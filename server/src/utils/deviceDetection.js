const detectDeviceInfo = (userAgent) => {
  if (!userAgent) {
    return {
      deviceType: "Unknown",
      browser: "Unknown",
      os: "Unknown"
    };
  }

  const ua = userAgent.toLowerCase();
  
  // Device Type Detection
  let deviceType = "Desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = "Mobile";
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = "Tablet";
  }

  // Browser Detection
  let browser = "Unknown";
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = "Chrome";
  } else if (ua.includes('firefox')) {
    browser = "Firefox";
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = "Safari";
  } else if (ua.includes('edg')) {
    browser = "Edge";
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = "Opera";
  }

  // OS Detection
  let os = "Unknown";
  if (ua.includes('windows')) {
    os = "Windows";
  } else if (ua.includes('mac')) {
    os = "macOS";
  } else if (ua.includes('linux')) {
    os = "Linux";
  } else if (ua.includes('android')) {
    os = "Android";
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = "iOS";
  }

  return {
    deviceType,
    browser,
    os
  };
};

export default detectDeviceInfo;