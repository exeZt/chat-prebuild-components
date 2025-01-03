namespace Chat {
	namespace ChatTypes {
		export interface IChat<T = IUser> extends IChatEvents {
			id: string;
			name: string;
			creator: string;
			users: T[];
			messages: IMessage[];
			avatar: IAttachment;
			avatars?: IAttachment[];
			supportChannel?: string; // link
		}

		export interface IChatEvents {
			onUserConnected: (user: IUser) => void;
			onUserLeaved: (user: IUser) => void;
			onUserKicked: (user: IUser) => void;
			onUserBanned: (user: IUser) => void;
			onUserGrantedAdminRole: (user: IUser, role: IChatRoles) => void;
			onChatDeleted: (chat: IChat) => void;
			onChatRenamed: (chatName: string) => void;
			onMessageCreated: (message: IMessage) => void;
		}

		export interface IMessage extends IMessageEvents {
			id: string;
			text: string;
			creator: string;
			chat: string;
			attachments?: IAttachment | IAttachment[];
			timestamp: Date | string | number;
		}

		export interface IMessageEvents {
			onCreated?: () => void;
			onTextChanged?: (text: string) => void;
			onAttachmentsAdded?: (attachment: IAttachment | IAttachment[]) => void;
			onAttachmentsRemoved?: () => void;
			onDeleted?: () => void;
			onResponsed?: () => void;
		}

		export interface IAttachment<T = string> {
			type: IAttachmentType;
			value: T;
		}

		export interface IUser<T = string | Blob> {
			id: string;
			username: string;
			firstname: string;
			surname: string;
			avatar?: T;
			avatars?: T[];
			createdDate: string | Date;
			language: TLang;
			settings: ISettings;
			contacts?: IContact | IContact[];
			phone?: string;
			mail?: string;
		}

		export interface ISettings {
			keymap: ISettingsKeyMappings;
			cookie?: "allow"
			| "allowNesessary"
			| "denyAll"

		}

		export interface ISettingsKeyMappings {
			sendMessage: string;
			changeCurrentChat: string; ///...etc
		}

		export interface IContact {
			id: string;
			name: string;
			phone: string;
			mail: string;
			chatUnlocked: boolean | true;
		}

		export type IChatRoles =
			"member" |
			"admin" |
			"moder";

		export type IAttachmentType =
			"image" |
			"video" |
			"sticker"

		export type TLang =
			"ru" |
			"en" |
			"ge" |
			"ua" |
			"by" |
			"kz";  ///...etc

		export interface IValidationClass {
			isCorrect: (value: string | number, regex?: string | RegExp, type?: string) => boolean;
		}

		export namespace IAppHandler { // implementation interfaces
			export interface IPreUser {
				login: () => Promise<void>;
				register: () => Promise<void>;
				recovery: () => Promise<void>;
			}
			export interface IUsers {
				enterChat: () => void;
				leaveChat: () => void;
				createChat: () => void;
				deleteChat: () => void;
				changeAccountCreds: () => void; // Account creds like password / mobile
				changeAccountPublic: () => void; // Simple account data, like avatar or fname
				blockUser: () => void;
				unblockUser: () => void;
				addContact: () => void;
				removeContact: () => void;
				editContact: () => void;
			}
			export interface IApp {
				changedSettings: () => void;
				notifyUsers: () => void;
			}
			export interface IChats {
				onEnteredChat: () => void;
				onLeavedChat: () => void;
				onEditedChat: () => void;
			}
			export interface IMailer { // use with ext. libs
				sendMail: () => void;
			}
		}
	}

	namespace ChatClasses {
		export class Validation implements ChatTypes.IValidationClass {
			protected regexMail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/ 
			protected regexMobile = /^[1-9]{1}[0-9]{7,11}$/ // widhout +7...
			protected regexUserName = /^[a-zA-Z0-9\-\_]{6,16}/ // from 6-16 symbols _- azAZ09
			protected regexUserFirstName = /^[a-zA-ZА-Яа-я]{2,16}/ // from 2-16 symbols _- azAZАЯая
			protected regexUserSecName = /^[a-zA-ZА-Яа-я]{1,32}/ // from 1-32 symbols _- azAZАЯая
		
			isCorrect = (value , regex) => {
				if (new RegExp(regex).test(value)) {
					return true;
				}
				else {
					return false;
				}
			}
		}

		export class AppHandler implements ChatTypes.IAppHandler.IApp {
      changedSettings: () => void;
      notifyUsers: () => void;
		}

    export class AppFlatStorage { // only for test purposes
      protected storage: {};

      constructor () {
        this.storage;
      }

      addToStorage = async (): Promise<void> => {
        
      }

      removeFromStorage = async (): Promise<void> => {
        
      }

      getFromStorage = async (): Promise<void> => {

      }
    }
	}

	namespace ChatVariables {
		export const ChatLimits: { [v: string]: number } = {
			maxMessageTextSize: 0xFA0, // 4000
			maxUserCountInChat: 0x2710, // 10000
			maxSocketIOTimeout: 0x2710,
			maxUserChats: 0x258 // 600
		}
	}

  namespace ChatDecorators {
    const colors: {[v: string]: string} = {
      error: '\x1b[31m%s\x1b[0m',
      warn: '\x1b[33m%s\x1b[0m',
      info: '\x1b[34m%s\x1b[0m',
    }

    export function Log (str: string) {
      return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        console.log(colors.info, `${str}\n`)
      }
    }

    export function LogErr (str: string) {
      return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        console.log(colors.error, `${str}\n`)
      }
    }

    export function LogWarn (str: string) {
      return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        console.log(colors.warn, `${str}\n`)
      }
    }
  }

  namespace ChatDataStructures {
    export function Stack() {
      this.count = 0
      this.storage = {}
  
      this.push = function(value) {
          this.storage[this.count] = value
          this.count++
      }
  
      this.pop = function() {
          if (this.count === 0) return undefined
          this.count--
          let result = this.storage[this.count]
          delete this.storage[this.count]
          return result
      }
  
      this.peek = function() {
          return this.storage[this.count - 1]
      }
  
      this.size = function() {
          return this.count
      }
    }

    export function Queue<T>() {
      let collection: T [] = []
  
      this.print = function() {
        console.log(collection)
      }
  
      this.enqueue = function(element) {
        collection.push(element)
      }
  
      this.dequeue = function() {
        return collection.shift()
      }
  
      this.front = function() {
        return collection[0]
      }
  
      this.isEmpty = function() {
        return collection.length === 0
      }
  
      this.size = function() {
        return collection.length
      }
    }

    function PriorityQueue<T>() {
      let collection: T [];

      this.enqueue = function(element) {
        if (this.isEmpty()) {
          collection.push(element)
        } else {
          let added = false
          for (let i = 0; i < collection.length; i++) {
            if (element[1] < collection[i][1]) {
              collection.splice(i, 0, element)
              added = true
              break;
            }
          }
          if (!added) {
            collection.push(element)
          }
        }
      }
    }
  }
}
