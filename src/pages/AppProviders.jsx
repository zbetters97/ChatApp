import ChatProvder from "src/features/chat/context/ChatProvider";
import AuthProvider from "src/features/auth/context/AuthProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ChatProvder>{children}</ChatProvder>
    </AuthProvider>
  );
}
