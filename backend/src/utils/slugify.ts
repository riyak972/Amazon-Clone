import slugifyLib from 'slugify';

export const generateSlug = (text: string) => {
    return slugifyLib(text, { lower: true, strict: true });
};
