import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Component Showcase - Color & Craft Dev Tools",
  description: "Component showcase with color system for Color & Craft website design",
};

export default function ComponentsPage() {
  return (
    <div className="container max-w-7xl py-10">
      <h1 className="text-3xl font-bold mb-6">Component Showcase</h1>
      <p className="text-muted-foreground mb-10">
        This page showcases the various UI components with our color system applied.
      </p>

      <Tabs defaultValue="buttons" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="forms">Form Controls</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon"><Info className="h-4 w-4" /></Button>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">Button States</h2>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button className="bg-primary-600 hover:bg-primary-700">Custom Color</Button>
              <Button className="bg-secondary-500 hover:bg-secondary-600 text-white">Teal Button</Button>
              <Button className="bg-accent-500 hover:bg-accent-600 text-white">Accent Button</Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="cards" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Card Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>This is a default card component</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the content of the card with default styling.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>

              <Card className="border-secondary-200 bg-secondary-50/50">
                <CardHeader className="text-secondary-800">
                  <CardTitle>Teal Theme Card</CardTitle>
                  <CardDescription className="text-secondary-600">Secondary color themed card</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-700">Custom styled card using our secondary color palette.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-secondary-300 text-secondary-700">Cancel</Button>
                  <Button className="bg-secondary-500 hover:bg-secondary-600">Save</Button>
                </CardFooter>
              </Card>

              <Card className="border-accent-200 bg-accent-50/50">
                <CardHeader className="text-accent-800">
                  <CardTitle>Accent Theme Card</CardTitle>
                  <CardDescription className="text-accent-600">Accent color themed card</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-accent-700">Custom styled card using our accent color palette.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-accent-300 text-accent-700">Cancel</Button>
                  <Button className="bg-accent-500 hover:bg-accent-600">Save</Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Alert Variants</h2>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a standard information alert with default styling.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert for errors and critical issues.
                </AlertDescription>
              </Alert>

              <Alert className="border-secondary-200 bg-secondary-50 text-secondary-800">
                <Info className="h-4 w-4 text-secondary-500" />
                <AlertTitle>Secondary Alert</AlertTitle>
                <AlertDescription className="text-secondary-700">
                  This is a custom alert using our secondary color palette.
                </AlertDescription>
              </Alert>

              <Alert className="border-success-100 bg-success-100/50 text-success-700">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription className="text-success-700">
                  This is a success alert using our success color palette.
                </AlertDescription>
              </Alert>

              <Alert className="border-warning-100 bg-warning-100/50 text-warning-700">
                <AlertTriangle className="h-4 w-4 text-warning-500" />
                <AlertTitle>Warning Alert</AlertTitle>
                <AlertDescription className="text-warning-700">
                  This is a warning alert using our warning color palette.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="forms" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Form Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="custom-input" className="text-primary-700">Custom Input</Label>
                  <Input 
                    id="custom-input" 
                    placeholder="Primary themed input" 
                    className="border-primary-200 focus:border-primary-400 focus:ring-primary-300" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-input" className="text-secondary-700">Secondary Input</Label>
                  <Input 
                    id="secondary-input" 
                    placeholder="Secondary themed input" 
                    className="border-secondary-200 focus:border-secondary-400 focus:ring-secondary-300" 
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="custom-switch" className="bg-accent-200 data-[state=checked]:bg-accent-500" />
                  <Label htmlFor="custom-switch" className="text-accent-700">Accent themed switch</Label>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="badges" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Badge Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              
              <Badge className="bg-primary-500 hover:bg-primary-600">Primary</Badge>
              <Badge className="bg-secondary-500 hover:bg-secondary-600">Teal</Badge>
              <Badge className="bg-accent-500 hover:bg-accent-600">Accent</Badge>
              <Badge className="bg-success-500 hover:bg-success-600 text-white">Success</Badge>
              <Badge className="bg-warning-500 hover:bg-warning-600 text-white">Warning</Badge>
              <Badge className="bg-danger-500 hover:bg-danger-600 text-white">Danger</Badge>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Custom Gradient Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-lg" style={{ background: "linear-gradient(135deg, #D3A273 0%, #C08A5A 100%)" }}>
            <h3 className="text-white text-xl font-bold mb-2">Primary Gradient</h3>
            <p className="text-white/90">This element uses our primary gradient background</p>
          </div>
          
          <div className="p-8 rounded-lg" style={{ background: "linear-gradient(135deg, #40BAA9 0%, #297A70 100%)" }}>
            <h3 className="text-white text-xl font-bold mb-2">Secondary Gradient</h3>
            <p className="text-white/90">This element uses our secondary gradient background</p>
          </div>
          
          <div className="p-8 rounded-lg" style={{ background: "linear-gradient(135deg, #E67A91 0%, #BA3D5D 100%)" }}>
            <h3 className="text-white text-xl font-bold mb-2">Accent Gradient</h3>
            <p className="text-white/90">This element uses our accent gradient background</p>
          </div>
          
          <div className="p-8 rounded-lg border border-border/30 relative overflow-hidden" 
               style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)" }}>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
            <h3 className="text-black text-xl font-bold mb-2">Glass Effect</h3>
            <p className="text-black/70">This element uses our glass gradient with a pattern background</p>
          </div>
        </div>
      </section>
    </div>
  );
} 