import React from "react";

// Types of project images
type ArtworkType = 'fraud-system' | 'card-verification' | 'website-optimization' | 'community-platform';

interface ProjectArtworkProps {
  type: ArtworkType;
  className?: string;
  inView: boolean;
}

/**
 * ProjectArtwork - Very simple static color-based project icons
 * No animations or complex SVGs for better performance
 */
const ProjectArtwork = ({ type, className = '' }: ProjectArtworkProps) => {
  // Get color based on project type
  const getBackgroundColor = () => {
    switch (type) {
      case 'fraud-system':
        return 'bg-blue-600/20';
      case 'card-verification':
        return 'bg-green-600/20';
      case 'website-optimization':
        return 'bg-purple-600/20';
      case 'community-platform':
        return 'bg-amber-600/20';
      default:
        return 'bg-slate-600/20';
    }
  };
  
  // Get icon class based on project type
  const getIconClasses = () => {
    switch (type) {
      case 'fraud-system':
        return 'before:content-["🔒"] before:text-4xl';
      case 'card-verification':
        return 'before:content-["💳"] before:text-4xl';
      case 'website-optimization':
        return 'before:content-["⚡"] before:text-4xl';
      case 'community-platform':
        return 'before:content-["🌐"] before:text-4xl';
      default:
        return 'before:content-["📱"] before:text-4xl';
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden w-full h-full ${className} ${getBackgroundColor()} flex items-center justify-center`}
    >
      <div className={`${getIconClasses()} flex items-center justify-center`} />
    </div>
  );
};

export default ProjectArtwork;