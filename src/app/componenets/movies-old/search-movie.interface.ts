
export interface ISearchMovie{

    page: number;
    results:ISearchMovieResult[];
    total_pages: number;
    total_results: number;
}

export interface ISearchMovieResult{

    backdrop_path: string;
    id: string;
    overview: string;
    poster_path:string;
    release_date: string;
    title: string;
    imdb_id:string;
    genres:any[];// id,name
    runtime:number;
    vote_average:number
}
