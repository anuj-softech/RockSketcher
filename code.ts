figma.showUI(__html__, { width: 360, height: 160 });

function figmaColorToHex(color: RGB): string {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function mapColorToTailwind(hex: string): string {
    const map: { [key: string]: string } = {
        '#000000': 'text-black',
        '#ffffff': 'text-white',
        '#1f2937': 'text-gray-800',
        '#6b7280': 'text-gray-500',
        '#f9fafb': 'text-gray-50',
        '#dc2626': 'text-red-600',
        '#16a34a': 'text-green-600',
        '#2563eb': 'text-blue-600'
    };
    return map[hex.toLowerCase()] || 'text-gray-800';
}

function mapAlign(align: string): string {
    switch (align) {
        case 'CENTER': return 'text-center';
        case 'RIGHT': return 'text-right';
        default: return 'text-left';
    }
}

function mapWeight(weight: number): string {
    if (weight <= 400) return 'font-normal';
    if (weight <= 500) return 'font-medium';
    if (weight <= 700) return 'font-bold';
    return 'font-extrabold';
}

function mapFontSize(size: number): string {
    if (size <= 12) return 'text-xs';
    if (size <= 14) return 'text-sm';
    if (size <= 16) return 'text-base';
    if (size <= 20) return 'text-lg';
    if (size <= 24) return 'text-xl';
    return 'text-2xl';
}

figma.ui.onmessage = () => {
    const selection = figma.currentPage.selection;
    const output: string[] = [];

    for (const node of selection) {
        if (node.type === 'TEXT') {
            const content = node.characters;

            const fontSize = mapFontSize(node.fontSize as number);
            const fontWeight = mapWeight(node.fontWeight as number);
            const align = mapAlign(node.textAlignHorizontal);
            const italic = node.fontName && typeof node.fontName !== "symbol" && node.fontName.style.includes("Italic") ? 'italic' : '';
            const fill = node.fills[0] && node.fills[0].type === 'SOLID'
                ? mapColorToTailwind(figmaColorToHex(node.fills[0].color as RGB))
                : 'text-gray-800';

            const tailwind = [fontSize, fontWeight, align, italic, fill].filter(Boolean).join(' ');
            output.push(`<p class="${tailwind}">${content}</p>`);
        }
    }

    figma.ui.postMessage(output.join('\n'));
};
