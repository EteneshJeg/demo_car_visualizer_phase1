import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Camera, Image } from "lucide-react";

const ImageSourceDialog = ({ isOpen, onClose, onSelectSource }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-white shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium mb-4">
                Choose Image Source
              </Dialog.Title>
              <div className="flex space-x-4">
                <button
                  onClick={() => onSelectSource("camera")}
                  className="btn btn-primary flex-1 text-white cursor-pointer"
                >
                  <Camera className="h-5 w-5 mx-auto" />
                  Camera
                </button>
                <button
                  onClick={() => onSelectSource("gallery")}
                  className="btn btn-secondary flex-1 text-white cursor-pointer"
                >
                  <Image className="h-5 w-5 mx-auto" />
                  Gallery
                </button>
              </div>
              <button
                onClick={onClose}
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Cancel
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageSourceDialog;
