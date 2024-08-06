"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "./SessionProvider";
import {
  addContent,
  clearDatabase,
  getAllContent,
  getContentChunk,
} from "../lib/db";
import { createSyncChannel, broadcastUpdate } from "../lib/sync";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

import { AntiScreenshot } from "./AntiScreenshot";

const CHUNK_SIZE = 1000; // Number of characters to load at a time

export function ContentManager() {
  const { session } = useSession();
  const [content, setContent] = useState("");
  const [contentList, setContentList] = useState([]);
  // const [syncChannel, setSyncChannel] = useState(null);
  const [expandedContent, setExpandedContent] = useState({});
  const fileInputRef = useRef(null);
  const syncChannelRef = useRef(null);

  const fetchContent = useCallback(async () => {
    try {
      const fetchedContent = await getAllContent();
      setContentList(fetchedContent);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    syncChannelRef.current = createSyncChannel((message) => {
      if (
        message.type === "CONTENT_UPDATED" ||
        message.type === "DATABASE_CLEARED"
      ) {
        fetchContent();
      }
    });
    // setSyncChannel(channel);

    return () => {
      if (syncChannelRef.current) syncChannelRef.current.close();
    };
  }, [fetchContent]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (content.trim() === "") return;

    try {
      const newContent = {
        text: content,
        session,
        timestamp: new Date().toISOString(),
        isFile: false,
      };
      await addContent(newContent);
      setContent("");
      fetchContent();
      broadcastUpdate(syncChannelRef.current, { type: "CONTENT_UPDATED" });
    } catch (error) {
      console.error("Failed to add content:", error);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const newContent = { text, session, isFile: true, fileName: file.name };
        await addContent(newContent);
        fetchContent();
        broadcastUpdate(syncChannelRef.current, { type: "CONTENT_UPDATED" });
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    };
    reader.readAsText(file);
  }

  async function loadMoreContent(id) {
    const currentContent = expandedContent[id] || "";
    const nextChunk = await getContentChunk(
      id,
      currentContent.length,
      currentContent.length + CHUNK_SIZE
    );
    setExpandedContent((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + nextChunk : nextChunk,
    }));
  }

  const handleClearDatabase = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      try {
        await clearDatabase();
        setContentList([]);
        setExpandedContent({});
        if (syncChannelRef.current)
          broadcastUpdate(syncChannelRef.current, { type: "DATABASE_CLEARED" });
        alert("Database cleared successfully.");
      } catch (error) {
        console.error("Failed to clear database:", error);
        alert("Failed to clear database. Please try again.");
      }
    }
  };

  return (
    <AntiScreenshot>
      <div>
        <form onSubmit={handleSubmit} className="mb-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here..."
            className="mb-2"
          />
          <Button type="submit" className="mr-2">
            Add Content
          </Button>
          <Input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button type="button" onClick={() => fileInputRef.current.click()}>
            Upload File
          </Button>
        </form>
        <Button
          onClick={handleClearDatabase}
          className="mb-4 bg-red-500 hover:bg-red-700"
        >
          Clear Database
        </Button>
        <ul>
          {contentList.map((item) => (
            <li key={item.id} className="mb-4 p-4 border rounded">
              <strong>{item.session}:</strong>
              {item.isFile && (
                <span className="ml-2">(File: {item.fileName})</span>
              )}
              <p>
                {expandedContent[item.id] || item.text.slice(0, CHUNK_SIZE)}
                {item.text.length > CHUNK_SIZE &&
                  !expandedContent[item.id] &&
                  "..."}
              </p>
              {item.text.length > CHUNK_SIZE &&
                (expandedContent[item.id] || "").length < item.text.length && (
                  <Button
                    onClick={() => loadMoreContent(item.id)}
                    className="mt-2"
                  >
                    Load More
                  </Button>
                )}
            </li>
          ))}
        </ul>
      </div>
    </AntiScreenshot>
  );
}
