import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/services/auth.service";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

const UserProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Personal info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if we have it in storage
        const storedUser = AuthService.getCurrentUserFromStorage();

        if (storedUser) {
          setUser(storedUser);
          setName(storedUser.name || "");
          setEmail(storedUser.email || "");
          setIsLoaded(true);
        }

        // Then fetch the latest data from the API
        const userData = await AuthService.getProfile();
        setUser(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement real API call to update profile
      // For now we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user in state and storage
      if (user) {
        const updatedUser = {
          ...user,
          name,
          email,
        };
        setUser(updatedUser);
        AuthService.saveUser(updatedUser);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The new password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Implement real API call to change password
      // For now we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Failed to change your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthProvider = (user: User | null) => {
    if (!user) return null;

    // Check for GitHub or Google email patterns
    const email = user.email.toLowerCase();
    if (email.includes("github")) return "GitHub";
    if (email.includes("gmail") || email.endsWith("googlemail.com")) return "Google";

    // Check for avatar URL patterns
    const avatar = user.avatar || "";
    if (avatar.includes("github")) return "GitHub";
    if (avatar.includes("googleusercontent")) return "Google";

    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const authProvider = getAuthProvider(user);
  const memberSince = user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "";

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {isLoaded ? (
          <div className="flex items-center space-x-6 mb-8">
            <Avatar className="h-24 w-24">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : (
                  <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                )}
            </Avatar>
            <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
                  {authProvider && (
                    <Badge variant="outline" className="ml-2">
                      {authProvider}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Member since {memberSince}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6 mb-8">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-24" />
            </div>
          </div>
          )}
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    {isLoaded ? (
                      <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                      />
                    </div>
                      </>
                    ) : (
                      <>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button type="submit" disabled={loading || !isLoaded}>
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Updating...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-6">
                    {isLoaded ? (
                      <>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                      />
                    </div>
                      </>
                    ) : (
                      <>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button type="submit" disabled={loading || !isLoaded}>
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Changing Password...
                        </>
                      ) : "Change Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
