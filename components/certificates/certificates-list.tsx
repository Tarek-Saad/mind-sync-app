"use client"

import { useState } from "react"
import { Plus, Trash2, AlertCircle, Edit, GripVertical, Link as LinkIcon, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Certificate } from "@/types/certificate"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { addCertificate, deleteCertificate, editCertificate } from "@/services/certificate-service"

interface CertificatesListProps {
  certificates: Certificate[]
  isLoading: boolean
  selectedPortfolio: string
  getDbUriForPortfolio: (portfolioId: string) => string
  onCertificateAdded: (certificate: Certificate) => void
  onCertificateEdited: (certificate: Certificate) => void
  onCertificateDeleted: (certificateId: string) => void
}

export function CertificatesList({ 
  certificates, 
  isLoading, 
  selectedPortfolio, 
  getDbUriForPortfolio,
  onCertificateAdded,
  onCertificateEdited,
  onCertificateDeleted
}: CertificatesListProps) {
  const [isAddCertificateDialogOpen, setIsAddCertificateDialogOpen] = useState(false)
  const [isEditCertificateDialogOpen, setIsEditCertificateDialogOpen] = useState(false)
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, '_id'>>({
    title: "",
    description: "",
    imgPath: "",
    orgLogos: [""],
    liveLink: "",
    order: 0
  })
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [editCertificateData, setEditCertificateData] = useState<Omit<Certificate, '_id'>>({
    title: "",
    description: "",
    imgPath: "",
    orgLogos: [""],
    liveLink: "",
    order: 0
  })
  const [isAddingCertificate, setIsAddingCertificate] = useState(false)
  const [isEditingCertificate, setIsEditingCertificate] = useState(false)
  const [addCertificateError, setAddCertificateError] = useState<string | null>(null)
  const [editCertificateError, setEditCertificateError] = useState<string | null>(null)
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null)
  const [isDeletingCertificate, setIsDeletingCertificate] = useState(false)
  const [deleteCertificateError, setDeleteCertificateError] = useState<string | null>(null)

  // Function to handle adding a new orgLogo field
  const handleAddOrgLogo = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditCertificateData({
        ...editCertificateData,
        orgLogos: [...editCertificateData.orgLogos, ""]
      });
    } else {
      setNewCertificate({
        ...newCertificate,
        orgLogos: [...newCertificate.orgLogos, ""]
      });
    }
  };

  // Function to handle removing an orgLogo field
  const handleRemoveOrgLogo = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      const updatedOrgLogos = [...editCertificateData.orgLogos];
      updatedOrgLogos.splice(index, 1);
      setEditCertificateData({
        ...editCertificateData,
        orgLogos: updatedOrgLogos
      });
    } else {
      const updatedOrgLogos = [...newCertificate.orgLogos];
      updatedOrgLogos.splice(index, 1);
      setNewCertificate({
        ...newCertificate,
        orgLogos: updatedOrgLogos
      });
    }
  };

  // Function to handle orgLogo input change
  const handleOrgLogoChange = (index: number, value: string, isEdit: boolean = false) => {
    if (isEdit) {
      const updatedOrgLogos = [...editCertificateData.orgLogos];
      updatedOrgLogos[index] = value;
      setEditCertificateData({
        ...editCertificateData,
        orgLogos: updatedOrgLogos
      });
    } else {
      const updatedOrgLogos = [...newCertificate.orgLogos];
      updatedOrgLogos[index] = value;
      setNewCertificate({
        ...newCertificate,
        orgLogos: updatedOrgLogos
      });
    }
  };

  // Function to handle adding a new certificate
  const handleAddCertificate = async () => {
    // Validate required fields
    if (!newCertificate.title.trim() || !newCertificate.description.trim() || 
        !newCertificate.imgPath.trim() || 
        newCertificate.orgLogos.some(logo => !logo.trim())) {
      setAddCertificateError("All fields are required");
      return;
    }

    setIsAddingCertificate(true);
    setAddCertificateError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      // Filter out empty orgLogo entries
      const filteredCertificate = {
        ...newCertificate,
        orgLogos: newCertificate.orgLogos.filter(logo => logo.trim() !== "")
      };

      const addedCertificate = await addCertificate(dbUri, selectedPortfolio, filteredCertificate);
      console.log("Certificate added:", addedCertificate);

      // Notify parent component
      onCertificateAdded(addedCertificate);

      // Reset the form and close the dialog
      setNewCertificate({
        title: "",
        description: "",
        imgPath: "",
        orgLogos: [""],
        liveLink: "",
        order: certificates.length > 0 ? Math.max(...certificates.map(c => c.order)) + 1 : 0
      });
      setIsAddCertificateDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding certificate:", error);
      setAddCertificateError(error.message);
    } finally {
      setIsAddingCertificate(false);
    }
  };

  // Function to open edit dialog and set initial values
  const handleOpenEditDialog = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setEditCertificateData({
      title: certificate.title,
      description: certificate.description,
      imgPath: certificate.imgPath,
      orgLogos: [...certificate.orgLogos],
      liveLink: certificate.liveLink || "",
      order: certificate.order
    });
    setIsEditCertificateDialogOpen(true);
  };

  // Function to handle editing a certificate
  const handleEditCertificate = async () => {
    if (!editingCertificate) return;

    // Validate required fields
    if (!editCertificateData.title.trim() || !editCertificateData.description.trim() || 
        !editCertificateData.imgPath.trim() || 
        editCertificateData.orgLogos.some(logo => !logo.trim())) {
      setEditCertificateError("All fields are required");
      return;
    }

    setIsEditingCertificate(true);
    setEditCertificateError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      // Filter out empty orgLogo entries
      const filteredCertificate = {
        ...editCertificateData,
        orgLogos: editCertificateData.orgLogos.filter(logo => logo.trim() !== "")
      };

      const updatedCertificate = await editCertificate(
        dbUri, 
        selectedPortfolio, 
        editingCertificate._id, 
        filteredCertificate
      );
      console.log("Certificate updated:", updatedCertificate);

      // Notify parent component
      onCertificateEdited(updatedCertificate);

      // Reset the form and close the dialog
      setEditingCertificate(null);
      setEditCertificateData({
        title: "",
        description: "",
        imgPath: "",
        orgLogos: [""],
        liveLink: "",
        order: 0
      });
      setIsEditCertificateDialogOpen(false);
    } catch (error: any) {
      console.error("Error editing certificate:", error);
      setEditCertificateError(error.message);
    } finally {
      setIsEditingCertificate(false);
    }
  };

  // Function to handle deleting a certificate
  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setIsDeletingCertificate(true);
    setDeleteCertificateError(null);

    try {
      const dbUri = getDbUriForPortfolio(selectedPortfolio);
      if (!dbUri) {
        throw new Error("No database URI found for the selected portfolio");
      }

      const result = await deleteCertificate(dbUri, selectedPortfolio, certificateToDelete._id);
      console.log("Certificate deleted:", result);

      // Notify parent component
      onCertificateDeleted(certificateToDelete._id);

      // Reset the state
      setCertificateToDelete(null);
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      setDeleteCertificateError(error.message);
    } finally {
      setIsDeletingCertificate(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Certificates</h2>
        <Button onClick={() => {
          setNewCertificate({
            title: "",
            description: "",
            imgPath: "",
            orgLogos: [""],
            liveLink: "",
            order: certificates.length > 0 ? Math.max(...certificates.map(c => c.order)) + 1 : 0
          });
          setIsAddCertificateDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleOpenEditDialog(certificate)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCertificateToDelete(certificate)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col h-full">
                <div className="mb-3 aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                  {certificate.imgPath ? (
                    <img 
                      src={certificate.imgPath} 
                      alt={certificate.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-lg mb-1">{certificate.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 flex-grow">{certificate.description}</p>
                <div className="mt-auto">
                  {certificate.orgLogos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {certificate.orgLogos.map((logo, index) => (
                        <div key={index} className="h-8 w-8 bg-gray-100 rounded-full overflow-hidden">
                          <img 
                            src={logo} 
                            alt={`Organization ${index + 1}`} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/100?text=Logo";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {certificate.liveLink && (
                    <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      <a href={certificate.liveLink} target="_blank" rel="noopener noreferrer" className="truncate">
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No certificates found for this portfolio. Add your first certificate to get started.
        </div>
      )}

      {/* Add Certificate Dialog */}
      <Dialog open={isAddCertificateDialogOpen} onOpenChange={setIsAddCertificateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Certificate</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificate-title" className="text-right">
                Title
              </Label>
              <Input
                id="certificate-title"
                value={newCertificate.title}
                onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                className="col-span-3"
                placeholder="MongoDB Certification"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="certificate-description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="certificate-description"
                value={newCertificate.description}
                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                className="col-span-3"
                placeholder="This certification validates skills in MongoDB database design and implementation."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificate-imgPath" className="text-right">
                Image Path
              </Label>
              <Input
                id="certificate-imgPath"
                value={newCertificate.imgPath}
                onChange={(e) => setNewCertificate({ ...newCertificate, imgPath: e.target.value })}
                className="col-span-3"
                placeholder="/assets/certificates/mongo.png"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Organization Logos
              </Label>
              <div className="col-span-3 space-y-2">
                {newCertificate.orgLogos.map((logo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={logo}
                      onChange={(e) => handleOrgLogoChange(index, e.target.value)}
                      placeholder="/assets/company/logo.png"
                      className="flex-1"
                    />
                    {newCertificate.orgLogos.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveOrgLogo(index)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => handleAddOrgLogo()}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Logo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificate-liveLink" className="text-right">
                Live Link
              </Label>
              <Input
                id="certificate-liveLink"
                value={newCertificate.liveLink}
                onChange={(e) => setNewCertificate({ ...newCertificate, liveLink: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/certificate"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificate-order" className="text-right">
                Order
              </Label>
              <Input
                id="certificate-order"
                type="number"
                value={newCertificate.order}
                onChange={(e) => setNewCertificate({ ...newCertificate, order: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            {addCertificateError && (
              <div className="text-red-500 text-sm mt-2">{addCertificateError}</div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddCertificate} disabled={isAddingCertificate}>
              {isAddingCertificate ? "Adding..." : "Add Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Certificate Dialog */}
      <Dialog open={isEditCertificateDialogOpen} onOpenChange={setIsEditCertificateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Certificate</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-certificate-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-certificate-title"
                value={editCertificateData.title}
                onChange={(e) => setEditCertificateData({ ...editCertificateData, title: e.target.value })}
                className="col-span-3"
                placeholder="MongoDB Certification"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-certificate-description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="edit-certificate-description"
                value={editCertificateData.description}
                onChange={(e) => setEditCertificateData({ ...editCertificateData, description: e.target.value })}
                className="col-span-3"
                placeholder="This certification validates skills in MongoDB database design and implementation."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-certificate-imgPath" className="text-right">
                Image Path
              </Label>
              <Input
                id="edit-certificate-imgPath"
                value={editCertificateData.imgPath}
                onChange={(e) => setEditCertificateData({ ...editCertificateData, imgPath: e.target.value })}
                className="col-span-3"
                placeholder="/assets/certificates/mongo.png"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Organization Logos
              </Label>
              <div className="col-span-3 space-y-2">
                {editCertificateData.orgLogos.map((logo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={logo}
                      onChange={(e) => handleOrgLogoChange(index, e.target.value, true)}
                      placeholder="/assets/company/logo.png"
                      className="flex-1"
                    />
                    {editCertificateData.orgLogos.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveOrgLogo(index, true)}
                        className="flex-shrink-0"
                        >                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => handleAddOrgLogo(true)}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Logo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-certificate-liveLink" className="text-right">
                Live Link
              </Label>
              <Input
                id="edit-certificate-liveLink"
                value={editCertificateData.liveLink}
                onChange={(e) => setEditCertificateData({ ...editCertificateData, liveLink: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/certificate"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-certificate-order" className="text-right">
                Order
              </Label>
              <Input
                id="edit-certificate-order"
                type="number"
                value={editCertificateData.order}
                onChange={(e) => setEditCertificateData({ ...editCertificateData, order: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            {editCertificateError && (
              <div className="text-red-500 text-sm mt-2">{editCertificateError}</div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditCertificate} disabled={isEditingCertificate}>
              {isEditingCertificate ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Certificate Confirmation Dialog */}
      <AlertDialog open={!!certificateToDelete} onOpenChange={(open) => !open && setCertificateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the certificate "{certificateToDelete?.title}" from your portfolio.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteCertificateError && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{deleteCertificateError}</span>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCertificate}
              disabled={isDeletingCertificate}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingCertificate ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}