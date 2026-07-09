const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Thinkbook/Downloads/he2026/src/components';
const appFile = 'c:/Users/Thinkbook/Downloads/he2026/src/App.tsx';

const files = [
  appFile,
  path.join(dir, 'VehicleList.tsx'),
  path.join(dir, 'RoomInfo.tsx'),
  path.join(dir, 'Itinerary.tsx'),
  path.join(dir, 'DelegationList.tsx'),
  path.join(dir, 'DriverInfo.tsx'),
  path.join(dir, 'ResortInfo.tsx')
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  // Use a simple replace with function for word-bounded class replacements
  content = content.replace(/(?<=^|\s|["'`]|:)text-(?:\[[0-9\.]+px\]|xs|sm|base|lg|xl|2xl|3xl)(?=$|\s|["'`])/g, (match) => {
    const map = {
      'text-[8px]': 'text-[10px]',
      'text-[9px]': 'text-[11px]',
      'text-[10px]': 'text-xs',
      'text-[10.5px]': 'text-[12.5px]',
      'text-[11px]': 'text-[13px]',
      'text-[12px]': 'text-sm',
      'text-xs': 'text-sm',
      'text-sm': 'text-base',
      'text-base': 'text-lg',
      'text-lg': 'text-xl',
      'text-xl': 'text-2xl',
      'text-2xl': 'text-3xl',
      'text-3xl': 'text-4xl'
    };
    return map[match] || match;
  });

  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated', f);
});
