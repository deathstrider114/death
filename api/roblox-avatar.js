module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    // Resolve the avatar directly by the account's Roblox user ID.
    // This avoids the usernames endpoint, which can fail independently.
    const userId = "2208824068";
    const response = await fetch(
      "https://thumbnails.roblox.com/v1/users/avatar?userIds=" +
      userId +
      "&size=720x720&format=Png&isCircular=false"
    );
    if (!response.ok) {
      return res.status(502).json({ imageUrl: null, error: "Roblox thumbnail service unavailable" });
    }
    const payload = await response.json();
    const imageUrl = payload && payload.data && payload.data[0] && payload.data[0].imageUrl;
    if (!imageUrl) {
      return res.status(502).json({ imageUrl: null, error: "Roblox did not return an avatar image" });
    }
    return res.status(200).json({ imageUrl });
  } catch (error) {
    return res.status(502).json({ imageUrl: null, error: "Avatar lookup failed" });
  }
};