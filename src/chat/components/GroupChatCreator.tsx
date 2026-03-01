"use client";

import { useState } from "react";
import { Users, X, Check, Search, ArrowLeft, Image } from "lucide-react";

interface ChatContact {
  id: string;
  username: string;
  email?: string;
  role?: string;
  isOnline?: boolean;
}

interface GroupChatCreatorProps {
  contacts: ChatContact[];
  onCreateGroup: (
    name: string,
    participantIds: string[],
    description?: string
  ) => Promise<void>;
  onCancel: () => void;
  isCreating?: boolean;
}

export default function GroupChatCreator({
  contacts,
  onCreateGroup,
  onCancel,
  isCreating = false,
}: GroupChatCreatorProps) {
  const [step, setStep] = useState<"select" | "details">("select");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleNext = () => {
    if (selectedContacts.size >= 2) {
      setStep("details");
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedContacts.size < 2) return;

    await onCreateGroup(
      groupName.trim(),
      Array.from(selectedContacts),
      groupDescription.trim() || undefined
    );
  };

  const getSelectedContactsInfo = () => {
    return contacts.filter((c) => selectedContacts.has(c.id));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          {step === "details" && (
            <button
              onClick={() => setStep("select")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isCreating}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <Users size={24} />
          <h2 className="text-lg font-semibold">
            {step === "select" ? "Select Members" : "Group Details"}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          disabled={isCreating}
        >
          <X size={20} />
        </button>
      </div>

      {/* Step 1: Select Participants */}
      {step === "select" && (
        <>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Selected Count */}
          {selectedContacts.size > 0 && (
            <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-purple-700">
                  {selectedContacts.size} member{selectedContacts.size !== 1 ? "s" : ""} selected
                  {selectedContacts.size < 2 && (
                    <span className="text-purple-500 ml-1">(minimum 2 required)</span>
                  )}
                </p>
                {selectedContacts.size > 0 && (
                  <button
                    onClick={() => setSelectedContacts(new Set())}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No contacts found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.has(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      className={`w-full p-4 flex items-center gap-3 transition-colors ${
                        isSelected
                          ? "bg-purple-50 hover:bg-purple-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={16} className="text-white" />}
                      </div>

                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                          {contact.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-medium text-gray-900 truncate">
                          {contact.username}
                        </h3>
                        {contact.email && (
                          <p className="text-sm text-gray-500 truncate">
                            {contact.email}
                          </p>
                        )}
                      </div>

                      {contact.role && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium capitalize">
                          {contact.role}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleNext}
              disabled={selectedContacts.size < 2}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                selectedContacts.size >= 2
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 2: Group Details */}
      {step === "details" && (
        <>
          <div className="flex-1 overflow-y-auto p-5">
            {/* Selected Members Preview */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Members ({selectedContacts.size + 1})
              </label>
              <div className="flex flex-wrap gap-2">
                {getSelectedContactsInfo().map((contact) => (
                  <div
                    key={contact.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    <span>{contact.username}</span>
                  </div>
                ))}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  You
                </div>
              </div>
            </div>

            {/* Group Name */}
            <div className="mb-5">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={50}
                disabled={isCreating}
              />
              <p className="mt-1 text-xs text-gray-500">{groupName.length}/50</p>
            </div>

            {/* Group Description */}
            <div className="mb-5">
              <label
                htmlFor="groupDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="What's this group about?"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={200}
                disabled={isCreating}
              />
              <p className="mt-1 text-xs text-gray-500">
                {groupDescription.length}/200
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> All members will be able to send messages and
                see the full conversation history.
              </p>
            </div>
          </div>

          {/* Create Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || isCreating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                groupName.trim() && !isCreating
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
