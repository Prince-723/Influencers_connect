import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import MessagesList from "@/components/messages/MessagesList";
import ChatWindow from "@/components/messages/ChatWindow";
import { Loader2 } from "lucide-react";
import { User } from "@shared/schema";

const MessagesPage = () => {
  const { userId } = useParams();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<number | null>(userId ? parseInt(userId) : null);

  // Get list of users to chat with
  const {
    data: chatUsers,
    isLoading: loadingUsers, 
    error: usersError,
  } = useQuery<User[]>({
    queryKey: [user?.userType === "business" ? "/api/influencers" : "/api/businesses"],
    enabled: !!user,
  });

  // When userId param changes, update activeChat
  useEffect(() => {
    if (userId) {
      setActiveChat(parseInt(userId));
    }
  }, [userId]);

  // Handle clicking on a user in the messages list
  const handleUserSelect = (selectedUserId: number) => {
    setActiveChat(selectedUserId);
    navigate(`/messages/${selectedUserId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-h-[600px]">
            {/* Messages list sidebar */}
            <div className="border-r border-gray-200">
              {loadingUsers ? (
                <div className="flex items-center justify-center h-full p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : usersError ? (
                <div className="p-4 text-red-600">Failed to load contacts</div>
              ) : (
                <MessagesList
                  users={chatUsers || []}
                  activeUserId={activeChat}
                  onSelectUser={handleUserSelect}
                />
              )}
            </div>

            {/* Chat window */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col">
              {activeChat ? (
                <ChatWindow currentUserId={user.id} otherUserId={activeChat} />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 p-6 text-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a contact from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
