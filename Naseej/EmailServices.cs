using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Naseej.Models;

namespace Naseej
{
    public class EmailServices
    {

        private readonly string _smtpServer = "smtp.gmail.com"; // Change to your SMTP server
        private readonly int _smtpPort = 587; // SMTP port
        private readonly string _smtpUser = "batoulkhazali96@gmail.com"; // Your email
        private readonly string _smtpPass = "ygpv tlkb kfza jwpb"; // Your email password or app password

        public async Task SendContactEmailAsync(string name, string fromEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(name, fromEmail));
            emailMessage.To.Add(new MailboxAddress("Naseej", "batoulkhazali96@gmail.com"));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain")
            {
                Text = $"Message from {name} ({fromEmail}):\n\n{message}"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }

        public async Task SendReplyEmailAsync(string senderEmail, string toEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("User", senderEmail)); // Sender's email
            emailMessage.To.Add(new MailboxAddress("Recipient", toEmail));  // Recipient's email
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain")
            {
                Text = message
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass); // SMTP server credentials
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }

        public async Task SendOrderEmail(string name, string toEmail, long? orderNumber, List<string> orderedItems, decimal? totalPrice, string address, decimal? shipping)
        {
            var emailMessage = new MimeMessage();
            emailMessage.To.Add(new MailboxAddress(name, toEmail));
            emailMessage.From.Add(new MailboxAddress("Naseej", "batoulkhazali96@gmail.com"));
            emailMessage.Subject = "تأكيد الطلب - شكراً لك على طلبك";
            string itemsList = string.Join("\n", orderedItems.Select(item => $"- {item}"));
            emailMessage.Body = new TextPart("html")
            {
                Text = $@"
        <div style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
            <h2 style=""color: #007bff;"">مرحباً {name}،</h2>
            <p>شكراً لك على طلبك رقم <strong>{orderNumber}</strong>.</p>
            <p>لقد تم استلام طلبك بنجاح، وفيما يلي تفاصيل الطلب:</p>
<div style=""background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"">
            <table style=""width: 100%; border-collapse: collapse; text-align: right;"">
                <thead>
                    <tr>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">اسم المنتج</th>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">الكمية</th>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">السعر النهائي</th>
                    </tr>
                </thead>
                <tbody>
                    {string.Join("", orderedItems.Select(item => $@"
                    <tr>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[0].Split(':')[1].Trim()}</td>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[1].Split(':')[1].Trim()}</td>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[2].Split(':')[1].Trim()} دينار</td>
                    </tr>"))}
                </tbody>
            </table>
        </div>
            <p>سوف يتم شحن الطلب إلى العنوان التالي:</p>
            <p style=""font-weight: bold;"">{address}</p>
            <p>نحن نقدر دعمك لنا! إذا كانت لديك أي أسئلة أو استفسارات، لا تتردد في التواصل معنا.</p>
            <p style=""color: #007bff; font-weight: bold;"">مع تحيات فريق الدعم من نسيج</p>
        </div>
        "
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }

        public async Task SendOrderStatusUpdateEmail(string name, string toEmail, long? orderNumber, string status, List<string> orderedItems, decimal? totalPrice, string address)
        {
            var emailMessage = new MimeMessage();
            emailMessage.To.Add(new MailboxAddress(name, toEmail));
            emailMessage.From.Add(new MailboxAddress("Naseej", "batoulkhazali96@gmail.com"));
            emailMessage.Subject = $"تحديث حالة الطلب - رقم الطلب {orderNumber}";

            //string itemsList = string.Join("\n", orderedItems.Select(item => $"- {item}"));

            string statusMessage;

            switch (status)
            {
                case "shipping":
                    statusMessage = "طلبك قيد الشحن، وسيتواصل معك فريق التوصيل قريباً.";
                    break;
                case "delivered":
                    statusMessage = "تم تسليم طلبك. نتمنى أن تكون تجربتك معنا مميزة!";
                    break;
                case "completed":
                    statusMessage = "تم إتمام طلبك بنجاح. شكراً لك على اختيارنا!";
                    break;
                case "canceled":
                    statusMessage = "تم إلغاء طلبك. نأسف لأي إزعاج قد تسببه هذه الحالة.";
                    break;
                case "error":
                    statusMessage = "تم إلغاء طلبك بسبب حدوث مشكلة. نأسف لأي إزعاج، ونأمل أن نتمكن من خدمتك بشكل أفضل في المستقبل.";
                    break;
                default:
                    statusMessage = "تم تحديث حالة طلبك.";
                    break;
            }


            emailMessage.Body = new TextPart("html")
            {
                Text = $@"
    <div style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
        <h2 style=""color: #007bff;"">مرحباً {name}،</h2>
        <p>نود إعلامك بأن حالة طلبك رقم <strong>{orderNumber}</strong> قد تم تحديثها.</p>
        <p>الحالة الحالية: <strong>{status}</strong>.</p>
        <p>{statusMessage}</p>
        <p>تفاصيل الطلب:</p>
<div style=""background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"">
            <table style=""width: 100%; border-collapse: collapse; text-align: right;"">
                <thead>
                    <tr>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">اسم المنتج</th>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">الكمية</th>
                        <th style=""border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"">السعر النهائي</th>
                    </tr>
                </thead>
                <tbody>
                    {string.Join("", orderedItems.Select(item => $@"
                    <tr>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[0].Split(':')[1].Trim()}</td>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[1].Split(':')[1].Trim()}</td>
                        <td style=""border: 1px solid #ddd; padding: 8px;"">{item.Split('-')[2].Split(':')[1].Trim()} دينار</td>
                    </tr>"))}
                </tbody>
            </table>
        </div>
        <p>إجمالي المبلغ: <strong>{totalPrice}</strong> دينار أردني.</p>
        <p>العنوان:</p>
        <p style=""font-weight: bold;"">{address}</p>
        <p>نشكرك على ثقتك بنا! إذا كانت لديك أي أسئلة أو استفسارات، لا تتردد في التواصل معنا.</p>
        <p style=""color: #007bff; font-weight: bold;"">مع أطيب التحيات،<br>فريق نسيج</p>
    </div>
    "
            };


            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }

        public async Task SendOrderErrorEmail (string name, string toEmail, string issueType, long? orderNumber)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Naseej", "batoulkhazali96@gmail.com")); 
            emailMessage.To.Add(new MailboxAddress(name, toEmail)); 
            emailMessage.Subject = $"مشكلة في الطلب - رقم الطلب {orderNumber}";

            string issueDescription;
            switch (issueType)
            {
                case "IncorrectAddress":
                    issueDescription = "العنوان المقدم غير صحيح. يرجى التحقق من العنوان وإرسال التفاصيل الصحيحة.";
                    break;
                case "OutOfStock":
                    issueDescription = "العنصر المطلوب غير متوفر حالياً. يمكنك اختيار عنصر بديل أو انتظار توفره.";
                    break;
                case "PaymentFailed":
                    issueDescription = "حدث خطأ أثناء معالجة الدفعة المالية. يرجى إعادة المحاولة أو استخدام طريقة دفع أخرى.";
                    break;
                case "DeliveryFailed":
                    issueDescription = "تمت محاولة تسليم الطلب ولكن لم نتمكن من الوصول إليك. يرجى تحديث تفاصيل الاتصال أو تحديد وقت تسليم جديد.";
                    break;
                case "DamagedItem":
                    issueDescription = "تم الإبلاغ عن وجود ضرر في أحد العناصر المطلوبة. يرجى التواصل معنا لحل المشكلة.";
                    break;
                case "WrongItemShipped":
                    issueDescription = "تم شحن عنصر غير صحيح. يرجى التواصل معنا لترتيب استبدال العنصر.";
                    break;
                case "StockAdjustment":
                    issueDescription = "حدثت مشكلة أثناء تعديل المخزون، مما أثر على طلبك. يرجى التواصل معنا لمعرفة الخيارات المتاحة.";
                    break;
                case "TechnicalIssue":
                    issueDescription = "حدث خطأ تقني أثناء معالجة طلبك. نعتذر عن الإزعاج ونطلب منك التواصل معنا لإعادة المحاولة.";
                    break;
                default:
                    issueDescription = "نواجه مشكلة تتعلق بطلبك. يرجى مراجعة التفاصيل واتخاذ الإجراء المطلوب.";
                    break;
            }

            emailMessage.Body = new TextPart("html")
            {
                Text = $@"
    <div style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
        <h2 style=""color: #d9534f;"">مرحباً {name}،</h2>
        <p>نأسف لإبلاغك بوجود مشكلة تتعلق بطلبك رقم <strong>{orderNumber}</strong>.</p>
        <p>نواجه مشكلة تتعلق بطلبك، ونحتاج إلى مساعدتك لحلها. التفاصيل كالتالي:</p>
        <div style=""background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"">
            <p>{issueDescription}</p>
        </div>
        <p>يرجى التواصل معنا عبر البريد الإلكتروني التالي لحل المشكلة:</p>
        <p style=""font-weight: bold; color: #007bff;"">support@naseej.com</p>
        <p>شكراً لتعاونك، ونتطلع إلى خدمتك بشكل أفضل.</p>
        <p style=""color: #007bff; font-weight: bold;"">مع تحيات فريق الدعم في نسيج</p>
    </div>
    "
            };


            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass); 
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }


    }
}
