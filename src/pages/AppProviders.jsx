import ChatProvder from "src/features/chat/context/ChatProvider";
import AuthProvider from "src/features/auth/context/AuthProvider";
import ThemeProvider from "src/features/theme/context/ThemeProvider";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvder>{children}</ChatProvder>
      </AuthProvider>
    </ThemeProvider>
  );
}
