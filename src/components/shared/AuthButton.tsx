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
  Loader2,
  ChevronDown,
  UserCircle,
  Mail,
  Crown,
  Heart
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
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Track online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('🔍 [AUTH] Loading timeout - setting loading to false');
      setLoading(false);
    }, 5000);

    // Get initial session and user data
    const getSession = async () => {
      try {
        console.log('🔍 [AUTH] Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          console.log('👤 [AUTH] User found, fetching profile...');
          // Fetch additional user data including role
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('id, email, full_name, avatar_url, role')
              .eq('id', session.user.id)
              .single();
            
            const userProfile = profile || {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
              role: 'customer'
            };
            
            setUserData(userProfile);
            console.log('✅ [AUTH] Profile loaded:', userProfile.role, userProfile.full_name);
          } catch (profileError) {
            console.error('❌ [AUTH] Error fetching user profile:', profileError);
            // Set fallback user data even if profile fetch fails
            setUserData({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
              role: 'customer'
            });
          }
        } else {
          console.log('🔍 [AUTH] No user session found');
          setUserData(null);
        }
        
        console.log('✅ [AUTH] Initial session check complete:', !!session?.user);
      } catch (error) {
        console.error('❌ [AUTH] Error getting initial session:', error);
        setUser(null);
        setUserData(null);
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('🔄 [AUTH] Auth state change:', event, !!session?.user);
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
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      console.log('🚪 [AUTH] Signing out user...');
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      router.refresh();
      router.push('/');
      console.log('✅ [AUTH] User signed out successfully');
    } catch (error) {
      console.error('❌ [AUTH] Error signing out:', error);
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

  const getAvatarGradient = (email?: string) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-teal-500 to-green-600',
      'from-red-500 to-orange-600',
    ];
    
    if (email) {
      const index = email.charCodeAt(0) % gradients.length;
      return gradients[index];
    }
    return gradients[0];
  };

  const isAdmin = userData?.role === 'admin';
  const isContributor = userData?.role === 'contributor';

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2 opacity-60">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  if (user && userData) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-12 px-3 gap-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 rounded-xl group"
          >
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-800 shadow-lg transition-transform duration-200 group-hover:scale-105">
                <AvatarImage 
                  src={userData.avatar_url} 
                  alt={userData.full_name || userData.email}
                  className="object-cover"
                />
                <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(userData.email)} text-white text-sm font-bold shadow-inner`}>
                  {getInitials(userData.full_name, userData.email)}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              } transition-colors duration-200`} />
            </div>
            
            <div className="hidden sm:flex flex-col items-start min-w-0">
              <div className="flex items-center gap-2 max-w-full">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {userData.full_name || 'User'}
                </span>
                {isAdmin && (
                  <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              {(isAdmin || isContributor) && (
                <Badge 
                  variant={isAdmin ? "default" : "secondary"} 
                  className={`text-xs px-2 py-0 h-5 ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Contributor'}
                </Badge>
              )}
            </div>
            
            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-72 p-0 shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl">
          {/* User Profile Header */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-700 shadow-lg">
                  <AvatarImage 
                    src={userData.avatar_url} 
                    alt={userData.full_name || userData.email}
                    className="object-cover"
                  />
                  <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(userData.email)} text-white font-bold`}>
                    {getInitials(userData.full_name, userData.email)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-700 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {userData.full_name || 'User'}
                  </h3>
                  {isAdmin && (
                    <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{userData.email}</span>
                </div>
                
                {(isAdmin || isContributor) && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-2 self-start border-0 ${
                      isAdmin 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <Heart className="w-3 h-3 mr-1" />
                        Contributor
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {/* Admin Panel Access */}
            {isAdmin && (
              <>
                <div className="px-3 py-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Administration
                  </h4>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-slate-100">Admin Dashboard</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">System overview & analytics</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/portfolio-dash" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-slate-100">Portfolio</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage showcase projects</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/chat" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-slate-100">Chat Management</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Customer conversations</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/services-dash" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-slate-100">Services</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage service offerings</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-3" />
              </>
            )}
            
            {/* Contributor Access */}
            {isContributor && !isAdmin && (
              <>
                <div className="px-3 py-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Content Management
                  </h4>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/portfolio-dash" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-slate-100">Portfolio</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage showcase projects</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-3" />
              </>
            )}
            
            {/* User Menu Items */}
            <div className="px-3 py-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                My Account
              </h4>
            </div>
            
            <DropdownMenuItem asChild>
              <Link href="/account/profile" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <UserCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100">Profile</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View your account details</p>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/account/settings" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100">Settings</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preferences & configuration</p>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-3" />
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg mx-1 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Sign Out</span>
                <p className="text-xs opacity-75">Log out of your account</p>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
} 