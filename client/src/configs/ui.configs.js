const uiConfigs = {
  style: {
    gradientBgImage: {
      dark: {
        backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
      },
      light: {
        backgroundImage: "linear-gradient(to top, rgba(245,245,245,1), rgba(0,0,0,0))"
      }
    },
    horizontalGradientBgImage: {
      dark: {
        backgroundImage: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))"
      },
      light: {
        backgroundImage: "linear-gradient(to right, rgba(245,245,245,0.5), rgba(0,0,0,0))"
      }
    },
    typoLines: (lines, textAlign) => ({
      textAlign: textAlign || "justify",
      display: "-webkit-box",
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: lines
    }),
    mainContent: {
      maxWidth: "1366px",
      m: "auto",
      p: 2
    },
    backgroundImage: (imgPath) => ({
      position: "relative",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "darkgrey",
      backgroundImage: `url(${imgPath})`
    })
  },
  size: {
    sidebarWith: "300px",
    contentMaxWidth: "1366px",
    // Responsive breakpoints
    mobileBreakpoint: "600px",
    tabletBreakpoint: "960px",
    desktopBreakpoint: "1280px",
    tvBreakpoint: "1920px"
  },
  responsive: {
    // Mobile-first responsive design
    mobile: {
      padding: { xs: 1, sm: 2 },
      margin: { xs: 0.5, sm: 1 },
      fontSize: { xs: '0.875rem', sm: '1rem' },
      spacing: { xs: 1, sm: 2 }
    },
    tablet: {
      padding: { sm: 2, md: 3 },
      margin: { sm: 1, md: 2 },
      fontSize: { sm: '1rem', md: '1.125rem' },
      spacing: { sm: 2, md: 3 }
    },
    desktop: {
      padding: { md: 3, lg: 4 },
      margin: { md: 2, lg: 3 },
      fontSize: { md: '1.125rem', lg: '1.25rem' },
      spacing: { md: 3, lg: 4 }
    },
    tv: {
      padding: { lg: 4, xl: 6 },
      margin: { lg: 3, xl: 4 },
      fontSize: { lg: '1.25rem', xl: '1.5rem' },
      spacing: { lg: 4, xl: 6 }
    }
  },
  // TV-friendly configurations
  tv: {
    focusRing: {
      outline: '3px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px'
    },
    largeText: {
      fontSize: { lg: '1.5rem', xl: '1.75rem' },
      lineHeight: 1.4
    },
    navigation: {
      buttonSize: { lg: 'large', xl: 'large' },
      iconSize: { lg: '2rem', xl: '2.5rem' }
    }
  }
}

export default uiConfigs