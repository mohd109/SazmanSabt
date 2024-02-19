// 1: Uncontrolled Tree
import { useRef, useState } from "react";

import { Tree } from "react-arborist";

import Node from "./Node";

import { TbFolderPlus } from "react-icons/tb";
import { AiOutlineFileAdd } from "react-icons/ai";

const Arborist = () => {
  const [term, setTerm] = useState("");
  const treeRef = useRef(null);
  const data = [
    { id: "1", name: "Raster1" },
    { id: "2", name: "Raster2" },
    {
      id: "3",
      name: "Online Basemaps",
      children: [
        { id: "c1", name: "Google" },
        { id: "c2", name: "Bing" },
        { id: "c3", name: "Open Street Map" },
      ],
    },
    {
      id: "4",
      name: "Offline Basemaps",
      children: [
        { id: "d1", name: "دهه 40" },
        { id: "d2", name: "دهه 50" },
        { id: "d3", name: "دهه 60" },
      ],
    },
  ];
  const createFileFolder = (
    <>
      <button
        onClick={() => treeRef.current.createInternal()}
        title="New Layer Group..."
      >
        <TbFolderPlus />
      </button>
      <button onClick={() => treeRef.current.createLeaf()} title="New Layer...">
        <AiOutlineFileAdd />
      </button>
    </>
  );

  return (
    <div>
      <div className="folderFileActions">{createFileFolder}</div>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <Tree
        ref={treeRef}
        initialData={data}
        width={260}
        height={1000}
        indent={24}
        rowHeight={32}
        // openByDefault={false}
        searchTerm={term}
        searchMatch={(node, term) =>
          node.data.name.toLowerCase().includes(term.toLowerCase())
        }
      >
        {Node}
      </Tree>
    </div>
  );
};

export default Arborist;
