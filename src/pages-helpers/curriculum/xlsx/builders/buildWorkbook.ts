import { safeXml } from "../../docx/xml";

export function buildWorkbook({ sheets }: { sheets: string[] }) {
  return safeXml`
    <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    <workbook
      xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      mc:Ignorable="x15 xr xr6 xr10 xr2"
      xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
      xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
      xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6"
      xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10"
      xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
    >
      <fileVersion
        appName="xl"
        lastEdited="7"
        lowestEdited="7"
        rupBuild="10511"
      />
      <workbookPr defaultThemeVersion="202300" />
      <mc:AlternateContent
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      >
        <mc:Choice Requires="x15">
          <x15ac:absPath
            url="/Users/orangemug/Documents/"
            xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"
          />
        </mc:Choice>
      </mc:AlternateContent>
      <xr:revisionPtr
        revIDLastSave="0"
        documentId="8_{274615AA-ECE0-644D-AB2E-12D373184771}"
        xr6:coauthVersionLast="47"
        xr6:coauthVersionMax="47"
        xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"
      />
      <bookViews>
        <workbookView
          xWindow="1100"
          yWindow="820"
          windowWidth="28040"
          windowHeight="17440"
          xr2:uid="{C98B37CC-FD85-FE4F-984F-54449C3C0043}"
        />
      </bookViews>
      <sheets>${sheets}</sheets>
      <calcPr calcId="181029" />
      <extLst>
        <ext
          uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}"
          xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
        >
          <x15:workbookPr chartTrackingRefBase="1" />
        </ext>
        <ext
          uri="{B58B0392-4F1F-4190-BB64-5DF3571DCE5F}"
          xmlns:xcalcf="http://schemas.microsoft.com/office/spreadsheetml/2018/calcfeatures"
        >
          <xcalcf:calcFeatures>
            <xcalcf:feature name="microsoft.com:RD" />
            <xcalcf:feature name="microsoft.com:Single" />
            <xcalcf:feature name="microsoft.com:FV" />
            <xcalcf:feature name="microsoft.com:CNMTM" />
            <xcalcf:feature name="microsoft.com:LET_WF" />
            <xcalcf:feature name="microsoft.com:LAMBDA_WF" />
            <xcalcf:feature name="microsoft.com:ARRAYTEXT_WF" />
          </xcalcf:calcFeatures>
        </ext>
      </extLst>
    </workbook>
  `.trim();
}
