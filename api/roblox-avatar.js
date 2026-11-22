module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  try {
    const lookup = await fetch("https://users.roblox.com/v1/usernames/users?username=DeathStrider114&excludeBannedUsers=true");
    if (!lookup.ok) return res.status(200).json({ imageUrl: null });
    const userData = await lookup.json();
    const userId = userData && userData.data && userData.data[0] && userData.data[0].id;
    if (!userId) return res.status(200).json({ imageUrl: null });

    const avatar = await fetch("https://thumbnails.roblox.com/v1/users/avatar?userIds=" + userId + "&size=720x720&format=Png&isCircular=false");
    if (!avatar.ok) return res.status(200).json({ imageUrl: null });
    const avatarData = await avatar.json();
    const imageUrl = avatarData && avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl;
    return res.status(200).json({ imageUrl: imageUrl || null });
  } catch (error) {
    return res.status(200).json({ imageUrl: null });
  }
};