"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  MessageSquare, 
  FolderOpen, 
  BarChart3,
  Palette,
  Loader2
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session and user data
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch additional user data including role
          const { data: profile } = await supabase
            .from('users')
            .select('id, email, full_name, avatar_url, role')
            .eq('id', session.user.id)
            .single();
          
          setUserData(profile || {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: 'customer'
          });
        }
        
        console.log('Initial session check:', !!session?.user);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state change:', event, !!session?.user);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user profile on sign in
          const { data: profile } = await supabase
            .from('users')
            .select('id, email, full_name, avatar_url, role')
            .eq('id', session.user.id)
            .single();
          
          setUserData(profile || {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: 'customer'
          });
        } else {
          setUserData(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const isAdmin = userData?.role === 'admin';
  const isContributor = userData?.role === 'contributor';

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (user && userData) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-12 px-3 gap-3 hover:bg-slate-100/80 transition-all duration-200">
            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
              <AvatarImage 
                src={userData.avatar_url} 
                alt={userData.full_name || userData.email}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-accent-500 text-white text-sm font-semibold">
                {getInitials(userData.full_name, userData.email)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-slate-900">
                {userData.full_name || 'User'}
              </span>
              {(isAdmin || isContributor) && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                  {isAdmin ? 'Admin' : 'Contributor'}
                </Badge>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64 p-2">
          <DropdownMenuLabel className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={userData.avatar_url} 
                  alt={userData.full_name || userData.email}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                  {getInitials(userData.full_name, userData.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                  {userData.full_name || 'User'}
                </span>
                <span className="text-sm text-slate-500">
                  {userData.email}
                </span>
                {(isAdmin || isContributor) && (
                  <Badge variant="outline" className="text-xs mt-1 self-start">
                    {isAdmin ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Contributor
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Admin Panel Access */}
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
                  <BarChart3 className="h-4 w-4 text-primary-600" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/portfolio-dash" className="flex items-center gap-3 cursor-pointer">
                  <Palette className="h-4 w-4 text-purple-600" />
                  <span>Manage Portfolio</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/chat" className="flex items-center gap-3 cursor-pointer">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Chat Dashboard</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/services-dash" className="flex items-center gap-3 cursor-pointer">
                  <FolderOpen className="h-4 w-4 text-green-600" />
                  <span>Manage Services</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* Contributor Access */}
          {isContributor && !isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/portfolio-dash" className="flex items-center gap-3 cursor-pointer">
                  <Palette className="h-4 w-4 text-purple-600" />
                  <span>Manage Portfolio</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* User Menu Items */}
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center gap-3 cursor-pointer">
              <User className="h-4 w-4 text-slate-600" />
              <span>My Account</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/account/settings" className="flex items-center gap-3 cursor-pointer">
              <Settings className="h-4 w-4 text-slate-600" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild className="bg-primary-600 hover:bg-primary-700">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
} 