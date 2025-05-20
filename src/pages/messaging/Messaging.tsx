
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Send } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BottomTabBar from "../../components/navigation/BottomTabBar";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  senderName: string;
  senderAvatar: string;
}

const Messaging = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Load contacts and conversations
    loadContacts();
  }, [user, navigate]);

  useEffect(() => {
    if (id && contacts.length > 0) {
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        setSelectedContact(contact);
        loadMessages(contact.id);
        
        // Set up real-time subscription for messages
        const channel = supabase
          .channel('messages-channel')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'messages',
              filter: `senderId=eq.${user?.id},receiverId=eq.${contact.id}` 
            },
            (payload) => {
              console.log('New message received:', payload);
              const newMsg = payload.new as Message;
              setMessages(prevMessages => [...prevMessages, newMsg]);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [id, contacts, user?.id]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      // For now, we'll show nearby providers as contacts for regular users
      // and show users who booked appointments for providers
      if (user.isProvider) {
        // For providers, load users who booked appointments
        // This is mock data for now, should be replaced with actual data
        const mockContacts = [
          { id: "user1", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
          { id: "user2", name: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith" }
        ];
        setContacts(mockContacts);
      } else {
        // For regular users, load nearby providers
        const { data: providers } = await supabase
          .from('service_providers')
          .select('*');
          
        if (providers) {
          const formattedContacts = providers.map(provider => ({
            id: provider.id,
            name: provider.business_name,
            avatar: provider.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.business_name)}`,
            providerId: provider.id // Store the provider ID for navigation
          }));
          setContacts(formattedContacts);
        }
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contactId: string) => {
    // This would normally fetch messages from a database
    // For now, we'll use mock data
    const mockMessages = [
      {
        id: '1',
        senderId: user?.id || '',
        receiverId: contactId,
        content: 'Hello! I need help with my sink.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        senderName: user?.name || '',
        senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=User'
      },
      {
        id: '2',
        senderId: contactId,
        receiverId: user?.id || '',
        content: 'Hi there! I can help you with that. What seems to be the problem?',
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        senderName: selectedContact?.name || 'Provider',
        senderAvatar: selectedContact?.avatar || 'https://ui-avatars.com/api/?name=Provider'
      }
    ];
    
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    // In a real app, this would send the message to the server
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: user?.id || '',
      receiverId: selectedContact.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderName: user?.name || '',
      senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=User'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Here we would also send the message to the Supabase database
    // For now this is just a placeholder
    console.log("Sending message to database:", newMsg);
  };
  
  const handleContactProfileClick = (contactId: string) => {
    if (selectedContact?.providerId) {
      navigate(`/provider/${selectedContact.providerId}`);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">
            {selectedContact ? selectedContact.name : "Messages"}
          </h1>
        </div>
      </div>

      {/* Content */}
      {selectedContact ? (
        // Chat view
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Provider profile at the top */}
          <div 
            className="flex items-center p-2 mb-4 bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => handleContactProfileClick(selectedContact.id)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
              <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedContact.name}</p>
              <p className="text-xs text-gray-500">Tap to view profile</p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== user?.id && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === user?.id 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-gray-100 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-primary-foreground/70' : 'text-gray-500'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                {message.senderId === user?.id && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      ) : (
        // Contacts list
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            contacts.length > 0 ? (
              <div className="divide-y">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedContact(contact);
                      navigate(`/messaging/${contact.id}`);
                    }}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-500">Tap to chat</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-gray-500 mb-4">No messages yet</p>
                <Button onClick={() => navigate('/search')}>
                  Find Service Providers
                </Button>
              </div>
            )
          )}
        </div>
      )}
      
      {/* Bottom Tab Bar */}
      <div className="mt-auto">
        <BottomTabBar />
      </div>
    </div>
  );
};

export default Messaging;
