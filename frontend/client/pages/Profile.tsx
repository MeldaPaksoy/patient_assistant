import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { User, Heart, Pill, Activity, FileText, Shield, LogOut, Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, updateProfile, logout, isAuthenticated, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    allergies: [] as string[],
    diseases: [] as string[],
    medications: [] as string[],
    past_surgeries: [] as string[]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        height_cm: user.height_cm?.toString() || '',
        weight_kg: user.weight_kg?.toString() || '',
        allergies: user.allergies || [],
        diseases: user.diseases || [],
        medications: user.medications || [],
        past_surgeries: user.past_surgeries || []
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleSave = async () => {
    try {
      await updateProfile({
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : undefined,
        weight_kg: formData.weight_kg ? parseInt(formData.weight_kg) : undefined
      });
      setIsEditing(false);
      // Force a page refresh to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Optionally show user-friendly error message
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setShowPasswordDialog(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully! You will be logged out for security purposes.');
      // AuthContext'teki changePassword fonksiyonu zaten logout yapıyor
    } catch (error) {
      console.error('Password change failed:', error);
      alert('Failed to change password. Please check your current password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password to confirm account deletion');
      return;
    }

    try {
      await deleteAccount(deletePassword);
      setShowDeleteDialog(false);
      alert('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please check your password.');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : 'Your Profile'}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
            <Button variant="ghost" onClick={logout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Health Data
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medical History
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>
                  Track your basic health measurements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {/* BMI Calculation */}
                {formData.height_cm && formData.weight_kg && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">BMI Calculation</h4>
                    <p className="text-lg">
                      BMI: {(parseInt(formData.weight_kg) / Math.pow(parseInt(formData.height_cm) / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allergies</CardTitle>
                  <CardDescription>
                    List your known allergies (separate with commas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayInput('allergies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Peanuts, Penicillin, Latex"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Medications</CardTitle>
                  <CardDescription>
                    List your current medications (separate with commas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.medications.join(', ')}
                    onChange={(e) => handleArrayInput('medications', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Aspirin 81mg, Lisinopril 10mg"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medications.map((medication, index) => (
                      <Badge key={index} variant="secondary">{medication}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Conditions</CardTitle>
                  <CardDescription>
                    List your current medical conditions (separate with commas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.diseases.join(', ')}
                    onChange={(e) => handleArrayInput('diseases', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Diabetes Type 2, Hypertension"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.diseases.map((disease, index) => (
                      <Badge key={index} variant="outline">{disease}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Surgeries</CardTitle>
                  <CardDescription>
                    List your surgical history (separate with commas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.past_surgeries.join(', ')}
                    onChange={(e) => handleArrayInput('past_surgeries', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Appendectomy 2020, Knee replacement 2019"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.past_surgeries.map((surgery, index) => (
                      <Badge key={index}>{surgery}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Change Password</h4>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Password</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <Input
                            id="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleChangePassword}>
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                  <div>
                    <h4 className="font-semibold text-red-600">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Please enter your password to confirm.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="deletePassword">Password</Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                          />
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800 font-semibold">⚠️ Warning</p>
                          <p className="text-sm text-red-700">
                            This will permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
