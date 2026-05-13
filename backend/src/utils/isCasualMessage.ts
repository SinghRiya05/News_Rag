export const isCasualMessage = (message: string) => {
    const casualMessages = [
        "hi",
        "hy",
        "hello",
        "hey",
        "hii",
        "hyy",
        "heyy",
        "how are you",
        "thanks",
        "thank you",
        "ok",
        "okay",
        "bye",
        "good morning",
        "good evening"
    ];

    return casualMessages.includes(
        message.toLowerCase().trim()
    );
};