package service

import (
	"errors"
	"time"

	"github.com/Abil-tech/Genius-Society/backend/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string     `json:"userId"`
	Role   model.Role `json:"role"`
	jwt.RegisteredClaims
}

type JWTService struct {
	secret      string
	expiryHours int
}

func NewJWTService(secret string, expiryHours int) *JWTService {
	return &JWTService{secret: secret, expiryHours: expiryHours}
}

func (s *JWTService) ExpiryHours() int {
	return s.expiryHours
}

func (s *JWTService) Generate(userID string, role model.Role) (string, error) {
	claims := Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(s.expiryHours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secret))
}

func (s *JWTService) Parse(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.secret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}
	return claims, nil
}