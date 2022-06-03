
export interface ISearchIMDB{
    searchType: string;
    expression: string;
    results:ISearchResultIMDB[];
    errorMessage: string;
}

export interface ISearchResultIMDB{
    resultType: string;
    id: string;
    image: string;
    title:string;
    description: string;
}

export interface ITitleResultIMDB{
    id: string;
    title:string;
    year: string;
    image: string;
    releaseDate:string;
    runtimeMins?: string | number;
    runtimeStr: string;
    plot: string;
    genreList:{key:string,value:string}[];
    imDbRating: string;
}
