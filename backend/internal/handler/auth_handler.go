package handler

import (
	"net/http"
	"regexp"

	"github.com/Abil-tech/Genius-Society/backend/internal/dto"
	"github.com/Abil-tech/Genius-Society/backend/internal/middleware"
	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

var adminIDPattern = regexp.MustCompile(`^ADM-\d{6}$`)

type AuthHandler struct {
	authService  *service.AuthService
	jwtService   *service.JWTService
	cookieDomain string
	cookieSecure bool
}

func NewAuthHandler(authService *service.AuthService, jwtService *service.JWTService, cookieDomain string, cookieSecure bool) *AuthHandler {
	return &AuthHandler{
		authService:  authService,
		jwtService:   jwtService,
		cookieDomain: cookieDomain,
		cookieSecure: cookieSecure,
	}
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type adminLoginRequest struct {
	AdminID  string `json:"adminId" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid request body"))
		return
	}

	user, err := h.authService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.Error("invalid email or password"))
		return
	}

	h.issueSession(c, user)
}

func (h *AuthHandler) LoginAdmin(c *gin.Context) {
	var req adminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.Error("invalid request body"))
		return
	}
	if !adminIDPattern.MatchString(req.AdminID) {
		c.JSON(http.StatusUnauthorized, dto.Error("invalid admin ID or password"))
		return
	}

	user, err := h.authService.LoginAdmin(c.Request.Context(), req.AdminID, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.Error("invalid admin ID or password"))
		return
	}

	h.issueSession(c, user)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", "", -1, "/", h.cookieDomain, h.cookieSecure, true)
	c.JSON(http.StatusOK, dto.Success(gin.H{"message": "logged out"}))
}

func (h *AuthHandler) Me(c *gin.Context) {
	claimsVal, _ := c.Get(middleware.UserContextKey)
	claims := claimsVal.(*service.Claims)
	c.JSON(http.StatusOK, dto.Success(gin.H{
		"userId": claims.UserID,
		"role":   claims.Role,
	}))
}

// issueSession: dipakai bersama oleh Login dan LoginAdmin supaya logic
// generate token + set cookie + response body tidak terduplikasi.
func (h *AuthHandler) issueSession(c *gin.Context, user *model.User) {
	token, err := h.jwtService.Generate(user.ID.Hex(), user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.Error("failed to generate token"))
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		"access_token",
		token,
		h.jwtService.ExpiryHours()*3600,
		"/",
		h.cookieDomain,
		h.cookieSecure,
		true,
	)

	c.JSON(http.StatusOK, dto.Success(gin.H{
		"user": gin.H{
			"id":    user.ID.Hex(),
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	}))
}