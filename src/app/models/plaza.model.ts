export class Plaza {
    constructor(
        public descripcion: string,
        public lng: string,
        public lat: string,
        public _id?: string,
        public tareas?: [],
        public activo?: Boolean
    ){}    
}