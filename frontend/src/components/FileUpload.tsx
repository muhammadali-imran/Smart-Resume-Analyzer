import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

const FileUpload = ({ onFileSelect, accept = ".pdf,.doc,.docx" }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const droppedFile = files[0];
        setFile(droppedFile);
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      onFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  isDragging ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse (PDF, DOC, DOCX)
              </p>
            </motion.div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleChange}
            />
          </motion.label>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-success/10 border border-success/30"
          >
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{(file.size / 1024).toFixed(1)} KB</span>
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-success">Ready to upload</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
