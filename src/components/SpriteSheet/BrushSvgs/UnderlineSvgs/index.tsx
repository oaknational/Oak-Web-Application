/**
 * The underline svgs are used in various places, some of which aren't
 * accounted for by Percy diffs, for instance in button focus states.
 * For this reason, please practise caution if changing them.
 */
import { FC } from "react";

import { SvgProps } from "../../getSvgId";

export const Underline1: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="0 0 242 7"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M241.809 5.35522C238.36 6.16872 234.702 6.32558 230.891 6.32486C205.669 6.32316 180.5 6.37674 155.305 6.30837C129.075 6.24358 102.854 6.03729 76.6237 5.95308C56.5815 5.88912 36.5201 5.94726 16.4689 5.88333C12.7528 5.83207 9.06734 5.66827 5.46556 5.3943C2.2246 5.18082 0.243077 4.15307 0.612482 3.14495C0.747438 2.77609 0.777943 2.40475 0.703578 2.03516C0.55282 1.68536 0.336376 1.33881 0.0553455 0.997265C1.97028 0.852173 3.91666 0.752723 5.87716 0.699803C20.5698 0.635225 35.2904 0.4596 49.9632 0.59757C65.3746 0.744085 80.7791 0.654862 96.1825 0.682135C131.421 0.745426 166.657 0.827222 201.889 0.927517C210.582 0.955764 219.254 1.16715 227.928 1.3286C230.171 1.37618 232.39 1.49113 234.554 1.67184C239.334 2.0603 241.604 3.03436 241.735 4.57053C241.705 4.81749 241.766 5.04471 241.809 5.35522ZM9.4054 5.0229L9.4071 4.83429L6.81271 4.84324C6.81204 4.91813 6.81136 4.99303 6.81066 5.07069L9.4054 5.0229ZM9.13633 1.89234C7.94722 2.89775 7.94725 2.89774 9.92041 2.8521C9.70711 2.53109 9.43974 2.21027 9.18139 1.89219L9.13633 1.89234ZM72.3962 1.26072L72.5866 1.12415L68.0824 1.1397L68.0812 1.27561L72.3962 1.26072ZM73.8843 3.05572L74.0187 3.14677L76.4058 3.13853L76.4066 3.04701L73.8843 3.05572ZM5.19841 1.04886L5.04392 1.20194L8.42203 1.19028L8.4234 1.03773L5.19841 1.04886Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export const Underline2: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="0 0 632 14"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M631.889 3.778c.095-.725-.206-1.449-.649-1.449-55.553-.207-165.203 4.684-223.4-.052 1.44-.129 2.707.104 3.245-.207-12.602-.414-26.914-.129-39.532.466 15.452-2.588 25.299-.052 38.804-.906-1.995-.104-12.365-.155-5.731-.233-5.035-.75-15.642-.078-17.637-.311-5.952-.776 14.249.181 13.837-.388C397.169.052 382.841.518 381.638 0c.016.647-.427.518-.237.699-72.209.569-149.404-.104-221.818.75.143 0 .254 0 .301.052-.237.078-1.187 0-.364-.052C113.054 3.002 72.002-.88 36.302 3.83 43.3.155 8.866 2.433 6.095 2.665c-4.085-.129-1.203.776-.158.259.222 2.174-5.351.104-4.322 2.536-15.278 16.769 82.768 2.769 93.628 6.728-2.549-1.32 12.08.673 13.283-.052-.617-.078-1.71-.259-2.929-.311-3.134-.052 4.987-1.19 3.499.311.633.44 2.771-.854 2.517 0 1.298.233 9.816-2.07 4.291-.026 4.987-.699 6.76 1.346 2.359-1.139 43.996 2.251 88.451-.673 131.577.052l247.971.699c-1.599-.828 1.757-1.087.902 0l57.707.518c-3.61-.466-2.739-1.501 1.013-.776 14.929 1.682 56.582 2.07 72.952.724-.316-.492.744-.336.729-.078.126-1.889.348-1.889-.048-1.682.032 0-.744.647-.522-.388.11-.518.728-.233.063-.75.412 0 1.536-.699.38-.492-2.106-1.501 1.583-.052.95-1.061-.285-.518-.222-2.562-.048-3.959zM384.187 1.061c1.472.078.079.259-.697 0-.475-.104-.316-.104.697 0zM12.46 2.821s.222-.052.174.026c-.032.026-.174.026-.174-.026zm.744-.802c.079 0 .111 0 .158.026h-.348s.111-.026.19-.026zm.206.466s-.047-.026 0-.052v.052zm13.52 1.087c-4.528-.621 2.945-.725 4.18.078-.158 0-3.768-.078-4.18-.078zm19.52-1.216c2.881 0-.886.129-1.393.026.206-.026.823-.026 1.393-.026zm15.468 4.451c-.238 0-.158-.026 0-.026v.026zm5.304-4.037c-8.66 1.165-22.196.518-24.127.052 5.953-.311 19.14-.155 26.502-.233-.728 0-1.536.078-2.375.181zm3.705 1.449c-.364-.052.237-.181.222 0h-.222zm-.871-1.63c.602-.052 1.14-.026 1.599 0a16.45 16.45 0 0 1-1.599 0zm3.356.104s-.586-.052-1.472-.104c1.346.052 2.026-.026 2.771.078-.095.026-.57.026-1.298.026zm.934-.621s.823-.052.902 0c-.174.052-.807.052-.902 0zm4.259 1.165s-.142 0-.206-.026c.253 0 .317 0 .206.026zm23.051-1.113c-.427-.052.348-.129.317-.052a.88.88 0 0 1-.317.052zm1.71 7.763c-.475 0-.317-.078 0-.052v.052zm26.455 1.501c-11.114.362 3.831-.932 4.163-1.346 0 .078-1.884 1.346-4.163 1.346zm5.762-9.73h-.886c-.681-.052 1.456-.026.886 0zm17.637.104a3.43 3.43 0 0 1 1.029 0c.602.026-1.647.026-1.029 0zm-5.62 9.471c-2.312.078-6.84.155-9.673.44-.855-1.734 10.132-.492 9.673-.44zm8.042 0c-.285.078-3.483.078-3.673.026-.411.129 4.338-1.708 3.673-.026zm4.116-.388c-.221 0-2.533.336-2.786.336.237-.181 3.831-.647 2.786-.336zm5.763-9.342c.111-.026.396-.026.507 0-.143.026-.364.026-.507 0zm21.42-.155c1.362 0-.174.026-.411.026.095-.026.237-.026.411-.026zm-2.406 5.667c-.412-.052 1.377-1.294 1.298-.673-.127.078-1.108.75-1.298.673zm3.578 1.734c-.333-.129-1.71-1.165-2.248-.983.601-.336 2.881.776 2.248.983zm-2.169-2.691c.253-.052 2.011-.129 1.805-.052.459.052-1.694.104-1.805.052zm3.34.233c-.506 0-1.171-.854-1.171-.906.158 0 2.976-.336 1.171.906zm-.348-2.769c-1.773.052-3.04-.621-3.261-.673-.792-.311 8.85.129 3.261.673zm3.847 4.606l-.712-1.087c-.697-1.009 1.583.673.712 1.087zm18.65-1.993c.728 0 1.441 1.294.902 1.32-1.836-.621-3.863-2.355-.902-1.32zm-13.346-2.277c1.298.44 7.409-2.096 2.897.595.269-.207-5.842-.673-2.897-.595zm3.261 1.604c.602-.569 1.789.932 1.552 1.708-.349 0-1.552-1.553-1.552-1.708zm6.08-.259c-2.027-.906 1.978-1.32 2.042-1.579 0 .078-1.219 1.656-2.042 1.579zm4.844 4.192c-1.488 0-2.47-.052-2.47-.052-.601-2.484 7.805 1.165 2.47.052zm4.275-.518c-2.676-1.19 1.424-.854 1.599-.802 0 .052-.871.802-1.599.802zm14.96-2.872c2.122 2.096-.759.595-1.076-.026.127-.052.633-.026 1.076.026zm-9.134 1.682c-1.267 1.294-.428-.621-.206-.802.807-.414 1.488.336.206.802zm2.105-1.811c-.095-.336-3.451-1.604-1.298-1.19.681-.155.871.052.063 0 .776.052 1.52 1.139 1.235 1.19zm2.438-1.423c-.997 0 .238-1.32 1.172-.983-.095.026-.855.983-1.172.983zm6.365 5.279c.506.052-7.536.181-3.705-.026 1.979 1.346 5.969-4.477 3.705.026zm7.124-.543c-1.9.052 1.805-1.061 1.884-1.113.253.104-1.283 1.19-1.884 1.113zm4.338-5.253c-.475-.414 1.947.595 2.232.078-.285.207-1.836 1.242-2.232-.078zm7.916 3.287c-2.09 0-1.536-.259.269-.518 2.137 1.216 1.551 1.035-.269.518zm10.053-1.941l-3.452.078c-.015.233 5.082-2.743 3.452-.078zm38.961-3.701c.539-.078.824-.052.855 0 .744 1.397-1.931-.104-.855 0zm-30.27 1.087c-1.203 1.734-3.087 0-4.512 0 0-.078 4.101-.104 4.512 0zm-5.05 2.64c-.839 1.475-1.504 1.372-.522-.75.696-1.216 1.947-1.035.522.75zm4.369 5.227c-.696 0-3.023 0-3.261-.181.57-.052 6.634-1.734 3.261.181zm5.542 0c-1.9-.207-1.774-1.268-.602-1.061 1.631-.311 3.546.155.602 1.061zm6.364-4.27c-.697-.026-.222-1.423.665-1.423 1.63.388 1.235 1.32-.665 1.423zm4.639-3.105c-2.977-.388-.206-1.19.854-.802 1.979-.595 2.154.052-.854.802zm5.604 7.065c-3.182.052-.063-.802 1.045-1.035.506.078-.317 1.035-1.045 1.035zm2.85-3.157c-.032.181-.222.854-1.267-.026-1.852-2.2 1.963-.336 1.267.026zm2.564.129c-1.171 0-3.261-.75-.949-.75.237-1.889 2.438.44.949.75zm1.552-4.348c-.649-.285-3.024-.802-.95-1.656.412 0 2.945 1.993.95 1.656zm1.52 6.625c.158-.052.95-1.889 2.169-.983l-2.169.983zm11.747-7.97c.997 0 4.148-.078 4.876.052.522.647-7.346 2.872-4.876-.052zm6.459 0c.222-.078 1.045-.052 1.251.104-5.842 3.364-1.789.052-1.251-.104zm10.053 7.867c-.348 0-2.01-.906-2.01-.957 0-.026 1.393-.388 1.614-.388 1.789.129.95 1.501.396 1.346zm20.866-3.39c-1.155.414-3.957.414-3.957 0-.491-.052 4.923-.466 3.957 0zm3.974 3.338c-9.024.233 4.481-1.19 3.863-.466 0 .311.348.311-3.863.466zm6.808-4.917c-.412 0-.76-.129-.76-.259.158-.673 2.39.155.76.259zm5.478-.44c-.159.336-.634.414-1.726.595-5.747.44 1.979-1.656 1.726-.595zm2.849.233c2.882-.078.618.88-.966.026.08-.026.396-.026.966-.026zm.095 1.294c.998 0 1.789.155 1.789.311-.491.181-5.747-.336-1.789-.311zm11.447 4.58c-2.834 1.113-7.9.285-10.94-.595 2.121.44 11.161-.129 10.94.595zm49.489-3.959c-.538.181-2.137.181-2.675 0 .712-.336 1.884-.311 2.675 0zm-5.477-2.251c2.596-.388 4.037-.388 4.037 0 .506.362-8.075.725-4.037 0zm-13.141-.854c1.283 0 1.108 1.967-.285.621-.332-.362-.57-.699.285-.621zm-4.163 0c1.298.078 2.311.207 3.071.621-.839.388-10.053-.647-3.071-.621zm-3.943 3.519c-6.966-.543 1.948-.906 2.454 0 0 .259-.902.259-2.454 0zm6.903-.854c-1.235.052-4.924-.543-1.567-.595 1.203-.052 4.908.518 1.567.595zm3.119-1.216c-1.393 0-2.343 0-2.676-.129 1.805-.518 9.737.181 2.676.129zm4.939 5.201c-1.63 0-3.087-.155-3.087-.285.665-.802 9.547.181 3.087.285zm10.908.285c-.126.336-9.863.828-4.037-.181 2.597-.595 5.478-.414 4.037.181zm5.177-2.769c-.95.155-.902 1.837-2.074-.181-.063 0-4.274.673-4.337.673.965-1.527 5.683-1.009 6.411-.492zm4.718-2.795c3.261.078-.253.207-1.203.052 0 0 .507-.052 1.203-.052zm-.633 3.571c-.333 0-.744-.129-.855-.285-.712-1.242 2.454.673.855.285zm2.58-.207c-1.013 0-1.709-.285-1.963-.569.412-1.139 6.602.336 1.963.569zm12.555 1.449c-4.211-.181-2.153-2.743 1.457-.88 1.298.44.949.88-1.457.88zm23.32-3.985c1.108-.259 1.615-.259 2.042 0 .57.362-3.752.285-2.042 0zm-2.296-1.009c3.737.078-.3.336-1.029.233-.775-.233-.316-.233 1.029-.233zm-12.538 5.46c.601-.699 2.28-.673 2.834 0-.776.44-2.058.44-2.834 0zm8.834-2.691c-5.605-.673 4.179-.44 5.478 0 5.367 1.604-4.607.492-5.478 0zm5.272 3.494c-.301-.44 5.794-.414 5.478 0-.333.647-4.924.336-5.478 0zm10.465-5.046c-4.623.362-1.615-2.096 1.424-.285.824.285.491.285-1.424.285zm6.253 5.719c-.285.052-4.718.311-4.892.052.538-.828 4.94-.026 5.24-.052-.205.052-.316 0-.348 0zm5.066-3.752c-.253 0-.443-.311-.443-.621.047-1.786 1.678.854.443.621zm10.037 2.303c-1.773.388-2.738.388-2.738 0-.412-.362 5.366-.725 2.738 0zm1.758-1.604c-5.921-.233 1.773-1.087 2.533-.207 0 0-1.093.207-2.533.207zm1.599-1.423c-6.016.078 2.28-1.087 2.723-.233 0 .233-1.14.233-2.723.233zm3.324 3.519c-.554-1.216 2.486-.181 2.407 0 .475.621-1.837.621-2.407 0zm7.821 1.32c.174.595-7.171-.104-3.578-.518 2.169-.259 4.259 0 3.578.518zm.982-4.089c-2.438-.052-2.47-.88 0-.699 2.327-.181 2.295.647 0 .699zm38.217-1.786c1.457 0 2.581.414 2.581.828-.807 1.553-7.963-.75-2.581-.828zm-28.845 1.527c-.316 0-.127-.207.57-.414 3.752-.983.443.906-.57.414zm3.451 4.218c-2.089 0-2.089-.932 0-.932 2.027 0 2.027.932 0 .932zm1.599-3.493c-.633 0-1.155-.129-1.155-.259-.364-.44 3.53.181 1.155.259zm.539-.906c-.602 0-1.393-.052-1.694-.233.38-.285 6.142.129 1.694.233zm13.377 2.717c-24.554.647 6.301-1.397 9.42-.336 0 0-4.369.336-9.42.336zm7.885 2.277c-6.555-.466 5.81-.259 5.557 0 .522.233-1.71.233-5.557 0zm12.697-3.261c-.491 1.346-4.782 3.131-2.264 1.423.617-.414 4.369-3.804 2.264-1.423zm1.884 2.64c1.155-.751 4.195-.699 5.335 0-1.457.492-3.879.492-5.335 0zm14.961-1.061c-4.481-.699 4.132-2.2 2.501-.492 0 .958-.38.958-2.501.492zm23.193-.518c-1.282 0-2.501 0-2.707-.285.522-1.527 8.264.311 2.707.285zm13.441.647c-7.71-.311 8.454-9.29.554-.311-.586.776 0 1.242-.554.311zm2.961-.104c0 .155-2.217.906-2.391.854.602-.259 3.23-3.882 2.391-.854zm1.187-1.423s.063-.052.095-.052c.095.181-.222.259-.095.052z"
        fill="currentColor"
      />
    </symbol>
  );
};
