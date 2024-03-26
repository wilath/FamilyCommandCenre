export interface Member {
    name: string;
    photo?: string;
    class: 'Adult' | 'Child' | 'Pet' | 'Guest';
    color: string;
}