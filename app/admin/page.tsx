"use client"
import { ArrowLeft, Users, Database, Settings, Shield, BarChart3, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of the system</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Portfolios"
          value="12"
          icon={<Database className="h-5 w-5" />}
          change="+2 this month"
          trend="up"
        />
        <StatsCard
          title="Total Users"
          value="24"
          icon={<Users className="h-5 w-5" />}
          change="+5 this month"
          trend="up"
        />
        <StatsCard
          title="Active Projects"
          value="18"
          icon={<BarChart3 className="h-5 w-5" />}
          change="+3 this week"
          trend="up"
        />
        <StatsCard
          title="System Health"
          value="98%"
          icon={<Shield className="h-5 w-5" />}
          change="Stable"
          trend="neutral"
        />
      </div>

      <Tabs defaultValue="portfolios" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolios">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>Manage all portfolios in the system</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Professional Portfolio</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>2 days ago</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Creative Portfolio</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>1 week ago</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Technical Portfolio</TableCell>
                    <TableCell>Alex Johnson</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>3 days ago</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all users in the system</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Portfolios</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>john@example.com</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>Jan 10, 2023</TableCell>
                    <TableCell>
                      <Badge variant="outline">Admin</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>jane@example.com</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>Feb 15, 2023</TableCell>
                    <TableCell>
                      <Badge variant="outline">User</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Alex Johnson</TableCell>
                    <TableCell>alex@example.com</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Mar 22, 2023</TableCell>
                    <TableCell>
                      <Badge variant="outline">User</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Manage all projects in the system</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">E-commerce Website</TableCell>
                    <TableCell>Professional Portfolio</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Jan 15, 2023</TableCell>
                    <TableCell>
                      <Badge>Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mobile App</TableCell>
                    <TableCell>Technical Portfolio</TableCell>
                    <TableCell>Alex Johnson</TableCell>
                    <TableCell>Feb 20, 2023</TableCell>
                    <TableCell>
                      <Badge>In Progress</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Logo Design</TableCell>
                    <TableCell>Creative Portfolio</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>Mar 5, 2023</TableCell>
                    <TableCell>
                      <Badge>Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Database Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure database connections and settings for the portfolio management system.
                  </p>
                  <Button variant="outline" className="w-fit mt-2">
                    <Database className="h-4 w-4 mr-2" />
                    Manage Database Settings
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">User Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure user roles and permissions for accessing different parts of the system.
                  </p>
                  <Button variant="outline" className="w-fit mt-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">System Maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform system maintenance tasks such as backupss, updates, and optimizations.
                  </p>
                  <Button variant="outline" className="w-fit mt-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance Tools
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ title, value, icon, change, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  )
}
