import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { ChatArea } from "@/components/chat/chat-area";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <ChatArea />
    </div>
  );
}
