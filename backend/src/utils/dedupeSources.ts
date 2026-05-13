export const dedupeSources = (sources: any[]) => {
    const map = new Map();

    sources?.forEach((item) => {
        const title = item.title || item.payload?.headline;

        if (!title) return;

        const key = title.trim();

        if (!map.has(key)) {
            map.set(key, {
                title: item.title || item.payload?.headline,
                link: item.link || item.payload?.link || "#",
                category: item.category || item.payload?.category || "Unknown",
                publishedAt: item.publishedAt || item.payload?.publishedAt || null,
            });
        }
    });

    return Array.from(map.values());
};