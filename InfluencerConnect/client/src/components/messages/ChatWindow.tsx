import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { Message, User } from "@shared/schema";

type ChatWindowProps = {
  currentUserId: number;
  otherUserId: number;
};

const ChatWindow = ({ currentUserId, otherUserId }: ChatWindowProps) => {
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Query the other user's information
  const {
    data: otherUser,
    isLoading: loadingUser,
    error: userError,
  } = useQuery<User>({
    queryKey: [otherUserId ? `/api/${otherUserId < currentUserId ? 'influencers' : 'businesses'}/${otherUserId}` : ''],
    enabled: !!otherUserId,
  });

  // Query messages between the two users
  const {
    data: messages,
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery<Message[]>({
    queryKey: [`/api/messages/${otherUserId}`],
    refetchInterval: 5000, // Refetch every 5 seconds to get new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        receiverId: otherUserId,
        content,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      setMessageInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest("PATCH", `/api/messages/${messageId}/read`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark unread messages as read when component mounts or messages change
  useEffect(() => {
    if (messages) {
      messages.forEach((message) => {
        if (message.receiverId === currentUserId && !message.read) {
          markAsReadMutation.mutate(message.id);
        }
      });
    }
  }, [messages, currentUserId, markAsReadMutation]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate(messageInput.trim());
    }
  };

  // Handle pressing Enter to send a message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    // If message is from this year, show date without year
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " " +
        messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString() +
      " " +
      messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loadingUser || loadingMessages) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userError || messagesError) {
    return (
      <div className="flex justify-center items-center h-full text-red-600">
        An error occurred while loading the conversation.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
          <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser?.name}</h3>
          <p className="text-xs text-gray-500">{otherUser?.userType}</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[75%]">
                {message.senderId !== currentUserId && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
                      <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{otherUser?.name}</span>
                  </div>
                )}
                <Card
                  className={`${
                    message.senderId === currentUserId
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </CardContent>
                </Card>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formatTimestamp(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
