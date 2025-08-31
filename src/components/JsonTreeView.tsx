import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/utils/cn';

interface JsonTreeViewProps {
  data: any;
  onEdit?: (path: string[], value: any) => void;
  onDelete?: (path: string[]) => void;
  searchQuery?: string;
  expandAll?: boolean;
  collapseAll?: boolean;
  readOnly?: boolean;
}

interface TreeNodeProps {
  keyName: string;
  value: any;
  path: string[];
  depth: number;
  isLast?: boolean;
  onEdit?: (path: string[], value: any) => void;
  onDelete?: (path: string[]) => void;
  searchQuery?: string;
  expandAll?: boolean;
  collapseAll?: boolean;
  readOnly?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  keyName,
  value,
  path,
  depth,
  onEdit,
  onDelete,
  searchQuery,
  expandAll,
  collapseAll,
  readOnly
}) => {
  const [isExpanded, setIsExpanded] = useState(expandAll || depth < 2);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showActions, setShowActions] = useState(false);
  
  React.useEffect(() => {
    if (expandAll !== undefined) setIsExpanded(expandAll);
  }, [expandAll]);
  
  React.useEffect(() => {
    if (collapseAll !== undefined) setIsExpanded(!collapseAll);
  }, [collapseAll]);

  const valueType = useMemo(() => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }, [value]);

  const isComplex = valueType === 'object' || valueType === 'array';
  const itemCount = isComplex ? Object.keys(value).length : 0;

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleEdit = useCallback(() => {
    if (readOnly) return;
    setEditValue(JSON.stringify(value));
    setIsEditing(true);
  }, [value, readOnly]);

  const handleSave = useCallback(() => {
    try {
      const newValue = JSON.parse(editValue);
      onEdit?.(path, newValue);
      setIsEditing(false);
    } catch (e) {
      // Show error
    }
  }, [editValue, path, onEdit]);

  const handleDelete = useCallback(() => {
    if (readOnly) return;
    onDelete?.(path);
  }, [path, onDelete, readOnly]);

  const renderValue = () => {
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="px-2 py-0.5 bg-background-primary border border-border-primary rounded text-sm"
            autoFocus
          />
        </div>
      );
    }

    if (isComplex) {
      return (
        <span className="text-text-tertiary">
          {valueType === 'array' ? `[${itemCount}]` : `{${itemCount}}`}
        </span>
      );
    }

    const getValueColor = () => {
      switch (valueType) {
        case 'string': return 'text-green-500';
        case 'number': return 'text-blue-500';
        case 'boolean': return 'text-orange-500';
        case 'null': return 'text-gray-500';
        default: return 'text-text-primary';
      }
    };

    const displayValue = valueType === 'string' ? `"${value}"` : String(value);

    return (
      <span className={cn('font-mono', getValueColor())}>
        {displayValue}
      </span>
    );
  };

  const isHighlighted = searchQuery && 
    (keyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (!isComplex && String(value).toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 py-1 px-2 hover:bg-background-tertiary/50 rounded group relative",
          isHighlighted && "bg-yellow-500/10"
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Drag handle */}
        {!readOnly && (
          <button 
            className="w-4 h-4 opacity-0 group-hover:opacity-50 cursor-move"
            title="드래그하여 재정렬"
          >
            ⋮⋮
          </button>
        )}

        {/* Expand/collapse button */}
        {isComplex && (
          <button
            onClick={handleToggle}
            className="w-4 h-4 flex items-center justify-center hover:bg-background-secondary rounded"
            title={isExpanded ? "접기" : "펼치기"}
          >
            <span className={cn(
              "text-xs transition-transform",
              isExpanded ? "rotate-90" : ""
            )}>
              ▶
            </span>
          </button>
        )}
        
        {!isComplex && <div className="w-4" />}

        {/* Key */}
        <span className="text-text-primary font-medium">
          {keyName}
        </span>

        {/* Separator */}
        <span className="text-text-tertiary">:</span>

        {/* Value */}
        {renderValue()}

        {/* Action buttons */}
        {!readOnly && showActions && (
          <div className="absolute right-2 flex items-center gap-1">
            {!isComplex && (
              <button
                onClick={handleEdit}
                className="p-1 hover:bg-background-secondary rounded"
                title="값 편집"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-status-errorLight rounded text-status-error"
              title="삭제"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              className="p-1 hover:bg-background-secondary rounded"
              title="추가 작업"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {isComplex && isExpanded && (
        <div className="ml-6 border-l border-border-primary/30">
          {Object.entries(value).map(([childKey, childValue], index) => (
            <TreeNode
              key={`${path.join('.')}.${childKey}`}
              keyName={childKey}
              value={childValue}
              path={[...path, childKey]}
              depth={depth + 1}
              isLast={index === Object.entries(value).length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
              searchQuery={searchQuery}
              expandAll={expandAll}
              collapseAll={collapseAll}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  onEdit,
  onDelete,
  searchQuery,
  expandAll,
  collapseAll,
  readOnly = false
}) => {
  if (!data) {
    return (
      <div className="p-4 text-text-tertiary text-center">
        표시할 데이터가 없습니다
      </div>
    );
  }

  const isRoot = typeof data === 'object' && data !== null;

  if (!isRoot) {
    // If data is a primitive, wrap it
    return (
      <div className="p-4">
        <TreeNode
          keyName="value"
          value={data}
          path={['value']}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
          searchQuery={searchQuery}
          expandAll={expandAll}
          collapseAll={collapseAll}
          readOnly={readOnly}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <TreeNode
        keyName={Array.isArray(data) ? 'array' : 'object'}
        value={data}
        path={[]}
        depth={0}
        onEdit={onEdit}
        onDelete={onDelete}
        searchQuery={searchQuery}
        expandAll={expandAll}
        collapseAll={collapseAll}
        readOnly={readOnly}
      />
    </div>
  );
};

export default JsonTreeView;