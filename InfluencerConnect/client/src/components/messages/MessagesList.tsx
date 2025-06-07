import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type MessagesListProps = {
  users: User[];
  activeUserId: number | null;
  onSelectUser: (userId: number) => void;
};

const MessagesList = ({ users, activeUserId, onSelectUser }: MessagesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  // Query messages for unread counts
  const { data: messages } = useQuery<any[]>({
    queryKey: ["/api/messages"],
  });

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Get unread message count for a user
  const getUnreadCount = (userId: number) => {
    if (!messages) return 0;
    return messages.filter((message) => message.senderId === userId && !message.read).length;
  };

  // Get last message between current user and another user
  const getLastMessage = (userId: number) => {
    if (!messages) return null;
    
    const userMessages = messages.filter(
      (message) => message.senderId === userId || message.receiverId === userId
    );
    
    if (userMessages.length === 0) return null;
    
    // Sort by date and get the most recent
    userMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return userMessages[0];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No contacts found</div>
        ) : (
          <ul>
            {filteredUsers.map((user) => {
              const lastMessage = getLastMessage(user.id);
              const unreadCount = getUnreadCount(user.id);

              return (
                <li
                  key={user.id}
                  className={`border-b cursor-pointer hover:bg-gray-50 ${
                    activeUserId === user.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => onSelectUser(user.id)}
                >
                  <div className="p-4 flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage
                            ? lastMessage.content.length > 25
                              ? `${lastMessage.content.substring(0, 25)}...`
                              : lastMessage.content
                            : "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
