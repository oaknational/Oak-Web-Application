# docx
Here is a little bit of knowledge all about docx, grab a cuppa tea ☕️ and lets dig in.

## Overview
`docx` is the file extension for the Microsoft Word file format. It's actually an open standard called "Office Open XML" or OOXML.

Here are some useful links to spec related things, you'll be referring to these a lot

 - http://officeopenxml.com/
 - https://ecma-international.org/publications-and-standards/standards/ecma-376/
   - note this one is scary big, but great for doing a quick _search_ for a term/tag as it's all in one big PDF


## File contents
A `.docx` file is actually a zip file with lots of XML files and also some other assets such as images and fonts.

If you take file, for example `foobar.docx` and rename it to `foobar.zip`. You should be able to unzip it and see the contents.

> [!NOTE]  
> The MacOS default "zip extract" doesn't support the zip format, you'll need to download <https://apps.apple.com/us/app/the-unarchiver/id425424353?mt=12> instead.

Once you've extracted the contents of the zip you should see the following

```bash
# ls -1    
[Content_Types].xml
_rels
customXml
docProps
word
```

> [!NOTE]  
> All the XML files have been formatted with the VSCode [XML Format](https://marketplace.visualstudio.com/items?itemName=mikeburgh.xml-format) extension. By default not new-line separated.

The file `[Content_Types].xml` is the top level file which tells us where everything else is located. 

```bash
# cat \[Content_Types\].xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/>
    <Default Extension="png" ContentType="image/png"/>
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <!-- [snip] -->
</Types>
```

The `ContentType=application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml` contains the structure of the document. For our purposes it's also always located at the location `./word/document.xml`

Another directory worth noting is `./word/media`

```bash
# ls -1 ./word/media 
image1.png
image10.png
image11.png
image12.png
[snip]
```

The above contains the embedded assets (images) in our file. Images are referenced in the `document.xml` by name.

```bash
# grep -r "image1.png" *
word/document.xml:                        <wp:docPr id="21" name="image1.png"/>
word/document.xml:                                        <pic:cNvPr id="0" name="image1.png"/>
word/document.xml:                        <wp:docPr id="40" name="image1.png"/>
word/document.xml:                                        <pic:cNvPr id="0" name="image1.png"/>
[snip]
```

## `./word/document.xml`
It's just an XML document, which defines rules, which in turn define the document.

A good way to get to grips with it is to

 1. Create something in MS Word
 2. Save it and unzip it
 3. Look at the structure of `./word/document.xml` in VSCode

It is however worth knowing the basic structure.


### Structure overview
The top level structure is as follows (simplified)

```xml
<w:document>
    <w:background w:color="FFFFFF"/>
    <w:body>
      <!-- contents of the file...  -->
    </w:body>
<w:document>
```

Within the `<w:body/>` element are the paragraphs and tables of the document. There are defined as follows

 - `<w:p/>` - root node of a paragraph
 - `<w:tbl/>` - root node a table

You can also create "sections" (`<w:sectPr/>`) which are further collections of `<w:tbl/>`/`<w:p>`.

### Paragraphs (`<w:p/>`)
Here is an example of a paragraph with some text

```xml
<!-- paragraph root node -->
<w:p>
    <!-- a "text run" -->
    <w:r>
        <w:rPr>
            <!-- styling rules for "text run" -->
            <w:color w:val="222222"/>
        </w:rPr>
        <!-- The actual text node, note we are preserving whitespace with xml:space="preserve"  -->
        <w:t xml:space="preserve">Hello world! </w:t>
    </w:r>
</w:p>
```


### Tables (`<w:tbl/>`)
Here is an example of a paragraph with some text

```
TODO...
```

## Styling

```
TODO...
```
