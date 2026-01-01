import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
function ReportDetailsPage() {
  return (
    <div className="bg-background-light font-display min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64  flex-col justify-between bg-white hidden lg:flex border-r border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-3 p-2 mb-4">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMLfrba4fje3OsxVDW2FmMI-asZsb6WgqyuB-KKG2N6YbWIwKpBqVkiuuC3MlWJ_624Z7Hp3yd3fweTddfWr8fAXhczI3fdmWWEsNexqlEQ50QRuvQMehLL8cO7UPWh9TTbuA2BvcLsTiaPrrlBaX_mAUPKknL9wyzT10TzlRdetjoZOqcvBc2xTqov2FpQsdn1oJNKx-YmloO6l_fftqeeitnfJno5HZ2kalariV24STKrz2vEPTXiehGQ9NAd4231sOL1UsszEwe")',
                }}
              />
              <div>
                <h1 className="text-black text-base font-medium">
                  Admin Panel
                </h1>
                <p className="text-gray-500 text-sm">admin@marketplace.com</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {[
                ["dashboard", "Dashboard"],
                ["list_alt", "Listings"],
                ["group", "Users"],
              ].map(([icon, label]) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}

              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
              >
                <span className="material-symbols-outlined !fill-1">flag</span>
                <span className="text-sm font-medium">Reports</span>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Settings</span>
              </a>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex gap-2 mb-4 text-sm sm:text-base">
              <a href="#" className="text-gray-500 hover:text-primary">
                Reports
              </a>
              <span className="text-gray-500">/</span>
              <span className="text-black font-medium">Report #12345</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-6">
              Report Details
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                <div className="bg-white p-6 rounded-xl border">
                  <h2 className="text-xl font-bold mb-4">Report Summary</h2>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="h-14 w-14 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfdJtWkZxCq__UhDsAqgy9gAj5odtMmZ3CBhJrKaohlCyn99d8I4_UNt-q9rR0N4cY2B4llEbpwI-lNBM_nREIV1XGB9r-47hjF-wyPZBbEJ7lJustvHWUOWGYqE8Z2qOQzvfEzAVLGWUs0wyQZw6kkBQEAQfKg0RZm4jGD6MYLhEH0IBEB_WCr5R6lfMtUqzAPjbv4F9abNrUQzDgtQDDc5Gs7Trlh6myUAZsLvnj5wJdWqw0_LJGcIyyQfcTZZUb_6ooCvzXsG-w")',
                      }}
                    />
                    <div>
                      <p className="font-medium">Jane Doe</p>
                      <p className="text-sm text-gray-500">
                        jane.doe@email.com
                      </p>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      Oct 26, 2023
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p>Misleading Item Description</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Message</p>
                      <p>
                        The item received was not as described in the listing.
                        The material is different and the size is incorrect.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white p-6 rounded-xl border">
                  <h2 className="text-xl font-bold mb-4">Actions</h2>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg">
                      Mark as Resolved
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant="destructive">Open</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <button className="px-4 py-2 text-sm font-semibold text-red-500 bg-red-500/10 rounded-lg">
                      Delete Listing
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold text-red-500">
                      Ban User
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="bg-white p-6 rounded-xl border sticky top-8 h-fit">
                <h2 className="text-xl font-bold mb-4">About this Listing</h2>

                <div
                  className="aspect-video rounded-lg bg-cover bg-center mb-4"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvSSfC81ofb9BASkUU6xYQtwPWOFaJ6N7cPSW2e951kIBe5fA7B3jsGQvt5e50y62CTtOJ12D1AeWpvlT_QiRlEQ-obrB50xWHwM1O6g-hAkQ6FX8Jq9E0zernDxa-vmM1bOeFHte-LABba82RAUFcGiq5PdQMhat7dIHNzl8BORKDWnMqfK0jntsYekWpU8Fggbu3B7nhGpmTarup5qpvCPqo2vwgHRQu51wH3tR1fgKfJCeVC9F2jNrC3PTF1G1r2RrqtrZB6oUP')",
                  }}
                />

                <p className="font-bold">Vintage Leather Jacket</p>
                <p className="text-primary font-semibold">$75.00</p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Seller</p>
                  <p>John Smith</p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ReportDetailsPage;
