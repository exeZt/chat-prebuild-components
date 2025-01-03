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
	}

	namespace ChatVariables {
		export const ChatLimits: any = {
			maxMessageTextSize: 0xFA0, // 4000
			maxUserCountInChat: 0x2710, // 10000
			maxSocketIOTimeout: 0x2710,
			maxUserChats: 0x258 // 600
		}
	}
}
