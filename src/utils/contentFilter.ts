import Filter from 'bad-words';

const indonesianBadWords = [
  'anjing', 'bangsat', 'bego', 'tolol', 'bodoh', 
  'kontol', 'kimak', 'puki', 'pukimak'
];

const filter = new Filter();
filter.addWords(...indonesianBadWords);

export const censorText = (text: string): string => {
  return filter.clean(text);
};

export const convertLinksToHyperlinks = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
};