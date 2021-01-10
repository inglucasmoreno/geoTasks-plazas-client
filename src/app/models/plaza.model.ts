export class Plaza {
    constructor(
        public descripcion: string,
        public lng: string,
        public lat: string,
        public fecha_ultima_visita?: string,
        public _id?: string,
        public tareas?: [],
        public activo?: Boolean
    ){}    
}