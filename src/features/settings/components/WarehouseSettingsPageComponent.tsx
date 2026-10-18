"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageSpinner, Spinner } from "@/components/ui/spinner";
import {
  useGetWarehouseSettings,
  useUpdateWarehouseSettings,
} from "@/features/settings/services/settings.api";
import { WarehouseSettings } from "@/features/settings/types";
import { RootState } from "@/redux/store";

const MAX_WAREHOUSE_CONTACTS = 5;

interface ContactRow {
  id?: string;
  name: string;
  phone: string;
}

const WarehouseSettingsForm = ({
  settings,
}: {
  settings: WarehouseSettings;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const canEdit =
    user?.role === "SUPER_ADMIN" ||
    !!user?.permissions?.canModifySystemConfig;

  const { mutateAsync: saveSettings, isPending: saving } =
    useUpdateWarehouseSettings();

  const [contacts, setContacts] = useState<ContactRow[]>(settings.contacts);

  const updateContact = (index: number, changes: Partial<ContactRow>) => {
    setContacts((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );
  };

  const addContact = () => {
    setContacts((rows) => [...rows, { name: "", phone: "" }]);
  };

  const removeContact = (index: number) => {
    setContacts((rows) => rows.filter((_, i) => i !== index));
  };

  const hasIncompleteContact = contacts.some(
    (contact) => !contact.name.trim() || !contact.phone.trim(),
  );

  const handleSave = async () => {
    const res = await saveSettings({ contacts });
    const saved = res.data?.data;
    if (saved) {
      // Sync server-assigned ids and trimmed values back into the form.
      setContacts(saved.contacts);
    }
  };

  return (
    <div className="px-xl pt-xl pb-main flex flex-col gap-7 max-w-[860px]">
      <div className="flex flex-col gap-2">
        <h3>Warehouse settings</h3>
        <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
          Manage the warehouse contacts shown when sharing an order over
          WhatsApp from the orders pages.
        </p>
      </div>

      {!canEdit && (
        <div className="rounded-xl border border-border-main bg-storey-foreground p-main">
          <p className="text-[14px] font-medium text-body leading-[1.5]">
            You can view these settings, but only a super admin (or an admin
            with configuration permissions) can change them.
          </p>
        </div>
      )}

      {/* ── Warehouse contacts ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white shadow-card p-main flex flex-col gap-main">
        <div className="flex items-start justify-between gap-main">
          <div className="flex flex-col gap-2">
            <h4>Warehouse contacts</h4>
            <p className="text-[13px] font-medium text-body-passive leading-[1.5]">
              A WhatsApp share button appears on every active order for each
              contact below. Numbers should include the country code, e.g.
              2348167163339.
            </p>
          </div>
          <span className="text-[13px] font-medium text-body-passive whitespace-nowrap">
            {contacts.length}/{MAX_WAREHOUSE_CONTACTS}
          </span>
        </div>

        {contacts.length === 0 && (
          <p className="text-[14px] font-medium text-body-passive py-main">
            No warehouse contacts yet. Add one so orders can be shared over
            WhatsApp.
          </p>
        )}

        {contacts.map((contact, index) => (
          <div
            key={contact.id ?? `new-${index}`}
            className="rounded-2xl border border-border-main p-main flex flex-col gap-main"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-main">
              <div className="flex flex-col gap-3">
                <Label htmlFor={`warehouse-name-${index}`}>Name</Label>
                <Input
                  id={`warehouse-name-${index}`}
                  value={contact.name}
                  disabled={!canEdit}
                  placeholder="e.g. Main Warehouse"
                  onChange={(e) =>
                    updateContact(index, { name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor={`warehouse-phone-${index}`}>
                  WhatsApp number
                </Label>
                <Input
                  id={`warehouse-phone-${index}`}
                  value={contact.phone}
                  disabled={!canEdit}
                  placeholder="e.g. 2348167163339"
                  onChange={(e) =>
                    updateContact(index, { phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeContact(index)}
                disabled={!canEdit}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                <span className="text-[13px]">Remove</span>
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between gap-main flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={addContact}
            disabled={!canEdit || contacts.length >= MAX_WAREHOUSE_CONTACTS}
          >
            <Plus className="size-4" />
            Add contact
          </Button>
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || hasIncompleteContact}
          >
            {saving && <Spinner color="white" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};

const WarehouseSettingsPageComponent = () => {
  const { data, isPending, isError } = useGetWarehouseSettings();

  if (!data) {
    if (isPending) {
      return (
        <div className="flex flex-col flex-1 gap-main justify-center items-center h-50">
          <PageSpinner />
        </div>
      );
    }

    return (
      <div className="px-xl pt-xl pb-main">
        <div className="rounded-xl border border-border-main bg-storey-foreground p-main">
          <p className="text-[14px] font-medium text-body leading-[1.5]">
            {isError
              ? "Warehouse settings could not be loaded. Please refresh and try again."
              : "No warehouse settings available."}
          </p>
        </div>
      </div>
    );
  }

  return <WarehouseSettingsForm settings={data} />;
};

export default WarehouseSettingsPageComponent;
