import type { Metadata } from "next";

//@ts-ignore
import "@/assets/styles/globals.css";
//@ts-ignore
import "@/assets/styles/gradient.css";
import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/providers/web3.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "CrediX - Global Freelancer Credit Platform",
  description:
    "CrediX helps freelancers build a verified credit and reputation profile to access loans, cross-chain income verification, and global opportunities.",
  icons: [
    {
      rel: "icon",
      type: "image/webp",
      url: "",
    },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: any;
}>) {
  return (
    <html lang="en">
      {/*  */}
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <Toaster
          position="top-center"
          duration={4000}
          toastOptions={{
            style: {
              borderRadius: "9999px", // Fully rounded corners
              background: "white",
              color: "black",
              padding: "1rem 2rem", // Add some padding for better appearance
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: add a subtle shadow
              zIndex: 1000,
            },
            className: "my-sonner-toast", // Optional: for additional custom CSS if needed
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <SidebarProvider>
              {children}
              {modal}
            </SidebarProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
