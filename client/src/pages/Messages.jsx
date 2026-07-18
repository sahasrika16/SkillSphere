import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  MessageCircle,
  RefreshCcw,
  Send,
  Search,
  Trash2,
  UserRound
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { messageService } from "../services/messageService";
import { socket } from "../services/socket";

const Messages = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  const getLoggedInUserId = () => {
    return user?._id || user?.id || user?.user?._id || "";
  };

  useEffect(() => {
    const userId = getLoggedInUserId();

    if (!userId) return;

    socket.connect();
    socket.emit("join", userId);

    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => msg._id === newMessage._id
        );

        if (alreadyExists) return prev;

        return [...prev, newMessage];
      });

      fetchChats();
    });

    socket.on("typing", (senderName) => {
      setTypingUser(senderName);
    });

    socket.on("stop-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.disconnect();
    };
  }, [user]);

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const data = await messageService.getMyChats();
      setConversations(data.conversations || []);

      if (!selectedChat && data.conversations?.length > 0) {
        setSelectedChat(data.conversations[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoadingMessages(true);
      const data = await messageService.getMessages(conversationId);
      setMessages(data.messages || []);
      await messageService.markAsRead(conversationId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOtherUser = (conversation) => {
    if (!conversation || !user) return null;

    if (user.role === "client") {
      return conversation.freelancer;
    }

    return conversation.client;
  };

  const handleDeleteConversation = async () => {
    if (!selectedChat?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this chat? It will be removed only from your account."
    );

    if (!confirmed) return;

    try {
      await messageService.deleteConversation(selectedChat._id);

      setConversations((prev) =>
        prev.filter((chat) => chat._id !== selectedChat._id)
      );

      setSelectedChat(null);
      setMessages([]);

      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete chat");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;
    if (!selectedChat) return;

    const receiver = getOtherUser(selectedChat);

    if (!receiver?._id) {
      toast.error("Receiver not found");
      return;
    }

    try {
      setSending(true);

      const data = await messageService.sendMessage({
        conversationId: selectedChat._id,
        receiverId: receiver._id,
        text: messageText.trim()
      });

      setMessages((prev) => [...prev, data.data]);
      socket.emit("send-message", data.data);
      setMessageText("");
      fetchChats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-7 overflow-x-hidden">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold text-blue-300">
                SkillSphere Messaging
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                Messages
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Continue project discussions with clients and freelancers in one
                focused workspace.
              </p>
            </div>

            <button
              onClick={fetchChats}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.13]"
            >
              <RefreshCcw size={17} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid w-full min-h-[650px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] backdrop-blur-xl lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex flex-col border-b border-white/10 lg:border-b-0 lg:border-r lg:w-[360px] lg:min-w-[360px]">
            <div className="border-b border-white/10 p-5">
              <h2 className="text-xl font-black">Conversations</h2>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <Search size={18} className="text-slate-500" />
                <input
                  placeholder="Search conversations..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3">
              {loadingChats ? (
                <div className="grid place-items-center p-10">
                  <Loader2 className="animate-spin text-blue-300" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="mx-auto text-blue-300" size={38} />
                  <h3 className="mt-4 font-black">No chats yet</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Conversations will appear after a project is started.
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  const isActive = selectedChat?._id === conversation._id;

                  return (
                    <button
                      key={conversation._id}
                      onClick={() => setSelectedChat(conversation)}
                      className={`mb-2 w-full rounded-2xl p-4 text-left transition ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-white/[0.04] hover:bg-white/[0.09]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">
                          {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate font-black">
                              {otherUser?.name || "User"}
                            </h3>
                            <span className="text-xs opacity-70">
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs opacity-75">
                            {conversation.gig?.title || "Project chat"}
                          </p>

                          <p className="mt-2 truncate text-sm opacity-90">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <main className="flex flex-1 min-h-[650px] flex-col">
            {!selectedChat ? (
              <div className="grid flex-1 place-items-center p-10 text-center">
                <div>
                  <MessageCircle className="mx-auto text-blue-300" size={54} />
                  <h2 className="mt-5 text-2xl font-black">
                    Select a conversation
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Choose a chat to view messages.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">
                        {getOtherUser(selectedChat)?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-black text-lg">
                          {getOtherUser(selectedChat)?.name || "User"}
                        </h2>

                        <p className="truncate text-sm text-slate-400">
                          {selectedChat.gig?.title || "Project conversation"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeleteConversation}
                      className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition-all duration-300 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                      Delete Chat
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  {loadingMessages ? (
                    <div className="grid h-full place-items-center">
                      <Loader2 className="animate-spin text-blue-300" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="grid h-full place-items-center text-center">
                      <div>
                        <MessageCircle
                          className="mx-auto text-blue-300"
                          size={42}
                        />
                        <h3 className="mt-4 font-black">No messages yet</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          Send the first message to start the discussion.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const loggedInUserId = getLoggedInUserId();

                        const senderId =
                          message.sender?._id ||
                          message.sender?.id ||
                          message.sender;

                        const isMine =
                          String(senderId) === String(loggedInUserId);

                        return (
                          <div
                            key={message._id}
                            className={`flex ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] rounded-[1.5rem] px-5 py-3 text-sm leading-6 shadow-lg ${
                                isMine
                                  ? "rounded-br-md bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-blue-500/20"
                                  : "rounded-bl-md border border-white/10 bg-slate-900 text-slate-200"
                              }`}
                            >
                              <p>{message.text}</p>

                              <p className="mt-2 text-right text-[11px] opacity-70">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                {typingUser && (
                  <div className="px-5 pb-3">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-white/10 p-5"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <UserRound size={19} className="text-slate-500" />

                    <input
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);

                        const receiver = getOtherUser(selectedChat);

                        if (receiver?._id) {
                          clearTimeout(window.typingTimeout);

                          socket.emit("typing", {
                            receiver: receiver._id,
                            sender: user.name
                          });

                          window.typingTimeout = setTimeout(() => {
                            socket.emit("stop-typing", {
                              receiver: receiver._id,
                              sender: user.name
                            });
                          }, 2500);
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                    />

                    <button
                      disabled={sending || !messageText.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-black transition hover:scale-[1.03] disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="animate-spin" size={17} />
                      ) : (
                        <Send size={17} />
                      )}
                      Send
                    </button>
                  </div>
                </form>
              </>
            )}
          </main>
        </section>
      </div>
    </AppLayout>
  );
};

export default Messages;