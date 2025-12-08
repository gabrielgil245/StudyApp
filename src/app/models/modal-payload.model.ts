export class ModalPayload {
    id: string;
    message: string;
    confirmed?: boolean;

    constructor(data: any) {
        this.id = data.id ?? '';
        this.message = data.message ?? '';
        this.confirmed = data.confirmed ?? false;
    }
}