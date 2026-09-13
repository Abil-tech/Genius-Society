package middleware

import (
	"net/http"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/Abil-tech/Genius-Society/backend/internal/service"
	"github.com/gin-gonic/gin"
)

const UserContextKey = "currentUser"

func AuthRequired(jwtService *service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := c.Cookie("access_token")
		if err != nil || tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		claims, err := jwtService.Parse(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Set(UserContextKey, claims)
		c.Next()
	}
}

// RequireRole HARUS dipasang setelah AuthRequired — bergantung pada
// context yang di-set AuthRequired.
func RequireRole(roles ...model.Role) gin.HandlerFunc {
	allowed := make(map[model.Role]bool, len(roles))
	for _, r := range roles {
		allowed[r] = true
	}
	return func(c *gin.Context) {
		claimsVal, exists := c.Get(UserContextKey)
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		claims := claimsVal.(*service.Claims)
		if !allowed[claims.Role] {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}