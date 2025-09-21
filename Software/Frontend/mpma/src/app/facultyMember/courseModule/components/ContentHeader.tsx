// * Interface for the simplified ContentHeader
interface ContentHeaderProps {
  title: React.ReactNode;
  isHidden: boolean;
}

// ! ContentHeader is now a simple display component.
// ! All buttons and actions are handled by the parent (SectionContent).
const ContentHeader: React.FC<ContentHeaderProps> = ({ title, isHidden }) => {
  return (
    <div className="flex items-center p-3 bg-background/80 rounded">
      <div className={`flex-1 ${isHidden ? "text-gray-500" : ""}`}>
        {isHidden ? "[Hidden] " : ""}
        {title}
      </div>
      {/* --- MODIFIED: ALL BUTTONS REMOVED FROM HERE --- */}
    </div>
  );
};

export default ContentHeader;
