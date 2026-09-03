package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// LandingContent is a singleton document (there is only ever one row in
// the landing_content collection). Field names/json tags mirror
// frontend/src/types/landing.ts exactly — keep both in sync manually
// whenever this struct changes.

type LandingNavbar struct {
	BrandName string `bson:"brandName" json:"brandName"`
}

type LandingHero struct {
	BadgeText        string `bson:"badgeText" json:"badgeText"`
	HeadingLine1     string `bson:"headingLine1" json:"headingLine1"`
	HeadingLine2     string `bson:"headingLine2" json:"headingLine2"`
	HeadingHighlight string `bson:"headingHighlight" json:"headingHighlight"`
	Subtext          string `bson:"subtext" json:"subtext"`
	CtaText          string `bson:"ctaText" json:"ctaText"`
	CtaLink          string `bson:"ctaLink" json:"ctaLink"`
}

type LandingStat struct {
	Icon  string `bson:"icon" json:"icon"`
	Value string `bson:"value" json:"value"`
	Label string `bson:"label" json:"label"`
}

type LandingFeatureItem struct {
	Icon        string `bson:"icon" json:"icon"`
	Title       string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`
}

type LandingFeatures struct {
	Heading    string               `bson:"heading" json:"heading"`
	Subheading string               `bson:"subheading" json:"subheading"`
	Items      []LandingFeatureItem `bson:"items" json:"items"`
}

type LandingFooter struct {
	BrandName string `bson:"brandName" json:"brandName"`
	Tagline   string `bson:"tagline" json:"tagline"`
}

type LandingContent struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty" json:"-"`
	Navbar    LandingNavbar       `bson:"navbar" json:"navbar"`
	Hero      LandingHero         `bson:"hero" json:"hero"`
	Stats     []LandingStat       `bson:"stats" json:"stats"`
	Features  LandingFeatures     `bson:"features" json:"features"`
	Footer    LandingFooter       `bson:"footer" json:"footer"`
	UpdatedAt time.Time           `bson:"updatedAt" json:"-"`
	UpdatedBy *primitive.ObjectID `bson:"updatedBy,omitempty" json:"-"`
}