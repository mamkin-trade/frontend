<template lang="pug">
  .home
    .land-head
      h1.land-header *MAMKIN TRADE*
      .land-info
        | Cryptocurrency 
        b trading
        |  platform, officially declared to be safe for your mental health.
    router-link(to='/') Main
    .privacy
      h2 Privacy Policy of Mamkin Trade
      p Mamkin Trade operates the mamkin.trade website, which provides the SERVICE.
      p This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Mamkin Trade website.
      p If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
      p The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at mamkin.trade, unless otherwise defined in this Privacy Policy. Our Privacy Policy was created with the help of the Privacy Policy Template and the Privacy Policy Generator from TermsFeed plus the Refund Policy Template.
      h3 Information Collection and Use
      p For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.
      h3 Log Data
      p We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
      h3 Cookies
      p Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive.
      p Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.
      h3 Service Providers
      ul We may employ third-party companies and individuals due to the following reasons:
        li To facilitate our Service;
        li To provide the Service on our behalf;
        li To perform Service-related services; or
        li To assist us in analyzing how our Service is used.
      p We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
      h3 Security
      p We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      h3 Links to Other Sites
      p Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
      h3 Children’s Privacy
      p Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
      h3 Changes to This Privacy Policy
      p We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
      h3 Contact Us
      p If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
    router-link(to='/') Main
    Footer
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class PrivacyPolicy extends Vue {}
</script>

<style lang='scss'>
@import "../assets/scss/style";

.privacy {
  width: 50%;
  margin: 0 auto;
}
</style>