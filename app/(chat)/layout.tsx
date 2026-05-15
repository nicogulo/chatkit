import { ChatSidebar } from "@/components/sidebar/chat-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
